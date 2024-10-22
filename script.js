document.addEventListener('DOMContentLoaded', function () {
    // Handling Tabs
    window.openTab = function(evt, tabName) {
        const tabcontent = document.getElementsByClassName("tabcontent");
        const tablinks = document.getElementsByClassName("tablinks");
        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    // Set default tab to be open
    document.querySelector('.tablinks').click();

    // Load disciplines from CSV
    fetch('disciplinas.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.trim().split('\n').slice(1); // Skip the header row
            const disciplines = rows.map(row => {
                const [area, subarea, subarea2, codigo, nome, categoria, curso, periodo] = row.split(',');
                return { area, subarea, subarea2, codigo, nome, categoria, curso, periodo };
            });

            const mandatory = disciplines.filter(d => d.categoria.trim() === 'Mandatória' && d.curso.trim() === 'Sistemas de Informação' && d.periodo.trim() === '2º');
            const elective = disciplines.filter(d => d.area.trim() === 'Ciências Exatas' && d.categoria.trim() === 'Optativa');

            renderMandatoryDisciplines(mandatory);
            renderElectiveDisciplines(elective);
            renderAreas(disciplines);
        });

    // Render mandatory disciplines for 2nd period of Sistemas de Informação
    function renderMandatoryDisciplines(disciplines) {
        const container = document.getElementById('mandatory-disciplines');
        container.innerHTML = ''; // Clear any existing content
        if (disciplines.length === 0) {
            container.innerHTML = '<p>Nenhuma disciplina obrigatória encontrada.</p>';
        } else {
            disciplines.forEach(d => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.setAttribute('data-disc', `${d.codigo} - ${d.nome}`);
                checkbox.addEventListener('change', updateFinalSchedule);
                const label = document.createElement('label');
                label.textContent = `${d.codigo} - ${d.nome}`;
                const br = document.createElement('br');
                container.appendChild(checkbox);
                container.appendChild(label);
                container.appendChild(br);
            });
        }
    }

    // Render elective disciplines for Ciências Exatas, grouped by subarea
    // Render elective disciplines for Ciências Exatas, grouped by subarea
    function renderElectiveDisciplines(disciplines) {
        const container = document.getElementById('optative-disciplines');
        container.innerHTML = ''; // Clear any existing content
        const groupedBySubarea = disciplines.reduce((acc, disc) => {
            if (!acc[disc.subarea]) acc[disc.subarea] = [];
            acc[disc.subarea].push(disc);
            return acc;
        }, {});

        for (let subarea in groupedBySubarea) {
            const subareaDiv = document.createElement('div');
            subareaDiv.classList.add('subarea');
            const subareaTitle = document.createElement('h4');
            subareaTitle.textContent = subarea;

            const ul = document.createElement('ul');
            groupedBySubarea[subarea].forEach(disc => {
                const li = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.setAttribute('data-disc', `${disc.codigo} - ${disc.nome}`);
                checkbox.addEventListener('change', updateFinalSchedule);
                li.appendChild(checkbox);
                li.appendChild(document.createTextNode(` ${disc.codigo} - ${disc.nome}`));
                ul.appendChild(li);
            });

            subareaDiv.appendChild(subareaTitle);
            subareaDiv.appendChild(ul);
            container.appendChild(subareaDiv);
        }
    }


    // Update the final schedule with selected disciplines
    function updateFinalSchedule() {
        const finalSchedule = document.getElementById('final-schedule');
        finalSchedule.innerHTML = ''; // Clear the previous schedule

        const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
        checkedBoxes.forEach(box => {
            const disc = box.getAttribute('data-disc');
            const li = document.createElement('li');
            li.textContent = disc;
            finalSchedule.appendChild(li);
        });
    }


    // Render areas with subareas and subareas2 as dropdowns
    function renderAreas(disciplines) {
        const container = document.getElementById('general-areas');
        const groupedByArea = disciplines.reduce((acc, disc) => {
            if (!acc[disc.area]) acc[disc.area] = {};
            if (!acc[disc.area][disc.subarea]) acc[disc.area][disc.subarea] = {};
            if (!acc[disc.area][disc.subarea][disc.subarea2]) acc[disc.area][disc.subarea][disc.subarea2] = [];
            acc[disc.area][disc.subarea][disc.subarea2].push(disc);
            return acc;
        }, {});

        for (let area in groupedByArea) {
            const areaDiv = document.createElement('div');
            areaDiv.classList.add('general-areas-section'); // Classe para espaçamento entre as áreas

            const areaButton = document.createElement('button');
            areaButton.textContent = area;
            areaButton.classList.add('dropdown-btn'); // Botão com borda arredondada

            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('dropdown-content');

            for (let subarea in groupedByArea[area]) {
                const subareaDiv = document.createElement('div');
                subareaDiv.classList.add('subarea');

                const subareaTitle = document.createElement('h4');
                subareaTitle.textContent = subarea;

                for (let subarea2 in groupedByArea[area][subarea]) {
                    const subarea2Div = document.createElement('div');
                    subarea2Div.classList.add('subarea2'); // Classe para organizar subareas2

                    const subarea2Title = document.createElement('h5');
                    subarea2Title.textContent = subarea2;

                    const ul = document.createElement('ul');
                    groupedByArea[area][subarea][subarea2].forEach(disc => {
                        const li = document.createElement('li');
                        li.textContent = `${disc.codigo} - ${disc.nome}`;
                        ul.appendChild(li);
                    });

                    subarea2Div.appendChild(subarea2Title);
                    subarea2Div.appendChild(ul);
                    subareaDiv.appendChild(subarea2Div);
                }

                categoryDiv.appendChild(subareaDiv);
            }

            areaDiv.appendChild(areaButton);
            areaDiv.appendChild(categoryDiv);
            container.appendChild(areaDiv);

            // Toggle dropdown functionality
            areaButton.addEventListener('click', function() {
                categoryDiv.classList.toggle('active');
            });
        }
    }

    // Update the final schedule with selected disciplines
    function updateFinalSchedule() {
        const finalSchedule = document.getElementById('final-schedule');
        finalSchedule.innerHTML = ''; // Clear the previous schedule

        const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
        checkedBoxes.forEach(box => {
            const disc = box.getAttribute('data-disc');
            const li = document.createElement('li');
            li.textContent = disc;
            finalSchedule.appendChild(li);
        });
    }

    // Search function for Núcleo Geral
    document.getElementById('searchBtn').addEventListener('click', function () {
        const query = document.getElementById('search').value.toLowerCase();
        const relatedDisciplines = document.getElementById('related-disciplines');
        relatedDisciplines.innerHTML = ''; // Clear previous results

        fetch('disciplinas.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.trim().split('\n').slice(1);
                const disciplines = rows.map(row => {
                    const [area, subarea, subarea2, codigo, nome] = row.split(',');
                    return { area, subarea, subarea2, codigo, nome };
                });

                // Filter disciplines based on the search query in name, area, subarea, or subarea2
                const results = disciplines.filter(disc => {
                    const keywords = [disc.nome, disc.codigo, disc.area, disc.subarea, disc.subarea2].join(' ').toLowerCase();
                    return keywords.includes(query);
                });

                // Display the results in the "related-disciplines" module
                if (results.length > 0) {
                    results.forEach(disc => {
                        const li = document.createElement('li');
                        li.textContent = `${disc.codigo} - ${disc.nome}`;
                        relatedDisciplines.appendChild(li);
                    });
                } else {
                    const li = document.createElement('li');
                    li.textContent = 'Nenhuma disciplina encontrada.';
                    relatedDisciplines.appendChild(li);
                }
            });
    });
});
