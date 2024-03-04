document.addEventListener('DOMContentLoaded', function () {
    const routesTableBody = document.getElementById('routesTableBody');
    const pagination = document.getElementById('pagination');
    const guidesTableBody = document.getElementById('guidesTableBody');
    let currentPage = 1;
    const itemsPerPage = 10; // Определение количества записей на странице
    let allRoutesData = []; // Данные о всех маршрутах

    function getRoutesData() {
        const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=3990d76f-4908-438c-a2e9-90a0a642eb96`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                allRoutesData = data;
                updateTable(currentPage);
            })
            .catch(error => {
                console.error('Ошибка получения данных о маршрутах:', error);
            });
    }


    const searchInput = document.getElementById('searchInput');
    const applyButton = document.querySelector('.btn-primary');

    applyButton.addEventListener('click', function () {
        event.preventDefault(); // Предотвращаем действие по умолчанию - перезагрузку страницы

        const searchTerm = searchInput.value.toLowerCase(); // Получаем введенный текст из поля поиска

        // Фильтруем данные по введенному тексту
        const filteredRoutes = allRoutesData.filter(route => {
            return route.name.toLowerCase().includes(searchTerm);
        });

        // Очищаем и обновляем таблицу с отфильтрованными данными
        routesTableBody.innerHTML = '';
        filteredRoutes.forEach(route => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const descriptionCell = document.createElement('td');
            const objectsCell = document.createElement('td');
            const buttonCell = document.createElement('td');
            const selectButton = document.createElement('button');

            nameCell.textContent = route.name;
            descriptionCell.textContent = route.description;
            objectsCell.textContent = route.mainObject;

            selectButton.textContent = 'Выбрать';
            selectButton.classList.add('btn', 'btn-secondary', 'selectRouteBtn');
            selectButton.addEventListener('click', function () {
                row.classList.toggle('selected');
                const routeId = route.id;
                const routeName = route.name;
                loadGuidesForRoute(routeId, routeName);
                updateSelectedRoute(routeName);
                populateLanguagesSelect(routeId);
            });

            buttonCell.appendChild(selectButton);

            row.appendChild(nameCell);
            row.appendChild(descriptionCell);
            row.appendChild(objectsCell);
            row.appendChild(buttonCell);

            routesTableBody.appendChild(row);
        });

        // Пересчитываем и создаем пагинацию для отфильтрованных данных
    });

    function updateTable(page) {

        routesTableBody.innerHTML = '';
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const routesData = allRoutesData.slice(startIndex, endIndex);

        routesData.forEach(route => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const descriptionCell = document.createElement('td');
            const objectsCell = document.createElement('td');
            const buttonCell = document.createElement('td');
            const selectButton = document.createElement('button');

            nameCell.textContent = route.name;
            descriptionCell.textContent = route.description;
            objectsCell.textContent = route.mainObject;

            selectButton.textContent = 'Выбрать';
            selectButton.classList.add('btn', 'btn-secondary', 'selectRouteBtn');
            selectButton.addEventListener('click', function () {
                row.classList.toggle('selected');
                const routeId = route.id;
                const routeName = route.name;
                loadGuidesForRoute(routeId, routeName);
                populateLanguagesSelect(routeId);
                updateSelectedRoute(routeName);
            });

            buttonCell.appendChild(selectButton);

            row.appendChild(nameCell);
            row.appendChild(descriptionCell);
            row.appendChild(objectsCell);
            row.appendChild(buttonCell);

            routesTableBody.appendChild(row);
        });

        createPagination();


        const searchInput = document.getElementById('searchInput').value.toLowerCase();

        // Фильтрация данных по поисковому запросу
        const filteredRoutesData = allRoutesData.filter(route =>
            route.name.toLowerCase().includes(searchInput)
        );

        // Отображение только отфильтрованных данных на странице

        // Остальной код отображения данных остается без изменений

        createPagination();
    }

    function createPagination() {

        pagination.innerHTML = '';
        const totalPages = Math.ceil(allRoutesData.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.classList.add('page-link');
            a.href = '#';
            a.textContent = i;

            if (i === currentPage) {
                li.classList.add('page-item', 'active');
            } else {
                li.classList.add('page-item');
            }

            a.addEventListener('click', function (event) {
                event.preventDefault();
                currentPage = i;
                updateTable(currentPage);
            });

            li.appendChild(a);
            pagination.appendChild(li);
        }
    }



    let selectedRoute = '';
    function loadGuidesForRoute(routeId, routeName) {
        const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routeId}/guides?api_key=3990d76f-4908-438c-a2e9-90a0a642eb96`;
        selectedRoute = routeName;
        const textforguide = document.getElementById("textforguide");
        const guideRoute = routeName;



        // Обновляем текст в элементе "textforguide"
        textforguide.textContent = `Доступные гиды по маршруту ${guideRoute}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                guidesTableBody.innerHTML = '';

                data.forEach(guide => {
                    const row = document.createElement('tr');
                    const nameCell = document.createElement('td');
                    const languageCell = document.createElement('td');
                    const workExperienceCell = document.createElement('td');
                    const pricePerHourCell = document.createElement('td');
                    const selectButtonCell = document.createElement('td');
                    const selectButton = document.createElement('button');

                    nameCell.textContent = guide.name;
                    languageCell.textContent = guide.language;
                    workExperienceCell.textContent = guide.workExperience;
                    pricePerHourCell.textContent = guide.pricePerHour;

                    selectButton.textContent = 'Выбрать';
                    selectButton.classList.add('btn', 'databutton', 'btn-secondary');
                    selectButton.setAttribute('data-price-per-hour', guide.pricePerHour);
                    selectButton.setAttribute('data-guide-id', guide.id);
                    selectButton.setAttribute('data-route-id', routeId);
                    selectButton.addEventListener('click', function () {

                        selectButton.classList.toggle('selectedG');

                        const guideName = guide.name;

                        document.getElementById('selectedGuide').value = guideName;
                        document.getElementById('selectedRoute').value = selectedRoute;

                        const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
                        orderModal.show();
                    });

                    selectButtonCell.appendChild(selectButton);

                    row.appendChild(nameCell);
                    row.appendChild(languageCell);
                    row.appendChild(workExperienceCell);
                    row.appendChild(pricePerHourCell);
                    row.appendChild(selectButtonCell);

                    guidesTableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Ошибка получения данных о гидах:', error);
            });
    }

    // Функция для обновления выбранного маршрута
    function updateSelectedRoute(routeName) {
        selectedRoute = routeName;
        document.getElementById('selectedRoute').value = selectedRoute;
    }

    getRoutesData();
    function populateLanguagesSelect(routeId) {
        const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routeId}/guides?api_key=3990d76f-4908-438c-a2e9-90a0a642eb96`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const languages = new Set();

                data.forEach(guide => {
                    languages.add(guide.language);
                });

                const selectElement = document.getElementById('selectLanguages');
                languages.forEach(language => {
                    const option = document.createElement('option');
                    option.value = language;
                    option.textContent = language;
                    selectElement.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Ошибка при получении данных о гидах:', error);
            });
    }
    document.getElementById('filterGuides').addEventListener('click', function () {
        const selectedLanguage = document.getElementById('selectLanguages').value;
        const minExperience = parseInt(document.getElementById('minExperience').value) || 0;
        const maxExperience = parseInt(document.getElementById('maxExperience').value) || Infinity;

        const guidesTableBody = document.getElementById('guidesTableBody');
        const routeButton = document.querySelector('.databutton');
        const routeId = parseInt(routeButton.getAttribute('data-route-id'));
        // Продолжайте выполнение кода, используя полученный routeId

        guidesTableBody.innerHTML = ''; // Очищаем предыдущие результаты


        const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routeId}/guides?api_key=3990d76f-4908-438c-a2e9-90a0a642eb96`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Фильтрация гидов по выбранному языку и опыту работы
                const filteredGuides = data.filter(guide => {
                    return (!selectedLanguage || guide.language === selectedLanguage) &&
                        (guide.workExperience >= minExperience && guide.workExperience <= maxExperience);
                });

                // Отображение отфильтрованных результатов в таблице
                filteredGuides.forEach(guide => {
                    const row = document.createElement('tr');
                    const nameCell = document.createElement('td');
                    const languageCell = document.createElement('td');
                    const workExperienceCell = document.createElement('td');
                    const pricePerHourCell = document.createElement('td');
                    const selectButtonCell = document.createElement('td');
                    const selectButton = document.createElement('button');
                    nameCell.textContent = guide.name;
                    languageCell.textContent = guide.language;
                    workExperienceCell.textContent = guide.workExperience;
                    pricePerHourCell.textContent = guide.pricePerHour;
                    selectButton.textContent = 'Выбрать';
                    selectButton.classList.add('btn', 'btn-secondary', 'databutton');

                    selectButton.addEventListener('click', function () {
                        selectButton.classList.toggle('selectedG');
                        const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
                        orderModal.show();
                    });
                    selectButtonCell.appendChild(selectButton);

                    row.appendChild(nameCell);
                    row.appendChild(languageCell);
                    row.appendChild(workExperienceCell);
                    row.appendChild(pricePerHourCell);
                    row.appendChild(selectButtonCell);

                    guidesTableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Ошибка при получении данных о гидах:', error);
            });
    });



    document.getElementById('calculateCost').addEventListener('click', function () {
        const hoursNumber = parseInt(document.getElementById('duration').value);
        console.log(hoursNumber)
        // Получаем дату экскурсии и время начала экскурсии из модального окна
        const tourDate = new Date(document.getElementById('tourDate').value);
        console.log(tourDate)
        const startTime = document.getElementById('startTime').value;
        console.log(startTime)
        // Рассчитываем множитель для праздничных дней, надбавку за утро и вечер
        const isThisDayOff = calculateIsThisDayOff(tourDate);
        console.log(isThisDayOff)

        const isItMorning = calculateIsItMorning(startTime);
        console.log(isItMorning)

        const isItEvening = calculateIsItEvening(startTime);
        console.log(isItEvening)

        let guidePricePerHour = parseFloat(document.querySelector('.btn.selectedG').getAttribute('data-price-per-hour'));
        console.log(guidePricePerHour)
        if (isNaN(guidePricePerHour)) {
            guidePricePerHour = 1400;
        }
        const numberOfVisitors = parseInt(document.getElementById('groupSize').value);
        console.log(numberOfVisitors)
        const guideId = parseFloat(document.querySelector('.btn.selectedG').getAttribute('data-guide-id'));
        const routeId = parseFloat(document.querySelector('.btn.selectedG').getAttribute('data-route-id'));


        const useGuideFastComing = document.getElementById('option1').checked;
        const useSubwayTransfer = document.getElementById('option2').checked;

        let guideFastComing = 1;
        let subwayTransfer = 1;

        if (useGuideFastComing) {
            guideFastComing = 1.3;
        }

        if (useSubwayTransfer) {
            const dayOfWeek = date.getDay(); // Получаем день недели (0 - воскресенье, 1 - понедельник, и т.д.)

            // Предположим, что праздничными будут суббота (6) и воскресенье (0)
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                subwayTransfer = 1.25; // Множитель для выходных
            } else {
                subwayTransfer = 1.3; // Множитель для буднего дня
            }
        }
        const totalPrice = calculatePrice(
            guidePricePerHour * guideFastComing * subwayTransfer,
            hoursNumber,
            isThisDayOff,
            isItMorning,
            isItEvening,
            numberOfVisitors
        );


        document.getElementById('totalCost').value = totalPrice.toFixed(2);
        const requestBody = {
            guide_id: 2, // Пример значения
            route_id: 20, // Пример значения
            date: '2024-01-15', // Пример значения в формате YYYY-MM-DD
            time: '14:30', // Пример значения в формате HH:MM
            duration: 2, // Пример значения от 1 до 3
            persons: 10, // Пример значения от 1 до 20
            price: 1500, // Пример значения
            optionFirst: 1, // Пример значения, передаваемого как 0 или 1 (ноль или единица)
            optionSecond: 0, // Пример значения, передаваемого как 0 или 1 (ноль или единица)
            student_id: 789 // Пример значения
            // Добавьте другие значения, если необходимо
        };


        document.getElementById('sendOrder').addEventListener('click', function () {
            fetch('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=94e79ed5-a807-4062-8af2-f303b21cc53b', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    alert('Заявка успешно создана. Проверьте в личном кабинете.');
                    // Обработайте данные, если необходимо
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    // Оповестите пользователя об ошибке, если необходимо
                });
        });
    });


    function calculatePrice(guideServiceCost, hoursNumber, isThisDayOff, isItMorning, isItEvening, numberOfVisitors) {
        let totalPrice = guideServiceCost * hoursNumber * isThisDayOff + isItMorning + isItEvening;

        if (numberOfVisitors > 0 && numberOfVisitors <= 5) {
            totalPrice += 0; // Надбавка за количество посетителей: от 1 до 5 человек – 0 рублей
        } else if (numberOfVisitors > 5 && numberOfVisitors <= 10) {
            totalPrice += 1000; // Надбавка за количество посетителей: от 5 до 10 – 1000 рублей
        } else if (numberOfVisitors > 10 && numberOfVisitors <= 20) {
            totalPrice += 1500; // Надбавка за количество посетителей: от 10 до 20 – 1500 рублей
        }

        return totalPrice;
    }

    function calculateIsThisDayOff(date) {
        const dayOfWeek = date.getDay(); // Получаем день недели (0 - воскресенье, 1 - понедельник, и т.д.)

        // Предположим, что праздничными будут суббота (6) и воскресенье (0)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return 1.5; // Множитель для праздничных дней
        } else {
            return 1; // Множитель для буднего дня
        }
    }

    // Функция для определения надбавки за утро
    function calculateIsItMorning(time) {
        const startTime = new Date(`01/01/2000 ${time}`); // Преобразуем время начала экскурсии в объект Date

        // Предположим, что утро - с 9 до 12 часов
        const morningStartTime = new Date(`01/01/2000 09:00`);
        const morningEndTime = new Date(`01/01/2000 12:00`);

        // Если время начала экскурсии находится в интервале утра, возвращаем надбавку, иначе возвращаем 0
        if (startTime >= morningStartTime && startTime <= morningEndTime) {
            return 400; // Надбавка за утро
        } else {
            return 0; // Надбавка за утро не начинается до 9 часов
        }
    }

    // Функция для определения надбавки за вечер
    function calculateIsItEvening(time) {
        const startTime = new Date(`01/01/2000 ${time}`); // Преобразуем время начала экскурсии в объект Date

        // Предположим, что вечер - с 20 до 23 часов
        const eveningStartTime = new Date(`01/01/2000 20:00`);
        const eveningEndTime = new Date(`01/01/2000 23:00`);

        // Если время начала экскурсии находится в интервале вечера, возвращаем надбавку, иначе возвращаем 0
        if (startTime >= eveningStartTime && startTime <= eveningEndTime) {
            return 1000; // Надбавка за вечер
        } else {
            return 0; // Надбавка за вечер не начинается после 20 часов
        }
    }

});
