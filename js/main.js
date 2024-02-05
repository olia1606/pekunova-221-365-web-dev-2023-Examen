let currentPage = 1;
const itemsPerPage = 8;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function displayData() {
  await delay(1000);
  document.getElementById("createdAt").textContent = locationData.created_at;

  await delay(1000);
  const coordinatesElement = document.getElementById("coordinates");
  coordinatesElement.textContent = Array.isArray(locationData.coords)
    ? locationData.coords.map((coord) => `[${coord.join(", ")}]`).join(", ")
    : locationData.coords;

  await delay(1000);
  document.getElementById("description").textContent = locationData.description;

  await delay(1000);
  document.getElementById("mainObject").textContent = locationData.mainObject;

  await delay(1000);
  document.getElementById("name").textContent = locationData.name;

  const locationContainer = document.getElementById("locationContainer");
  if (locationContainer) {
    locationContainer.style.opacity = 1;
  } else {
    console.error('Element with ID "locationContainer" not found.');
  }
}

window.onload = displayData;

const apiKey = "ceb20e17-1296-4f47-9a7f-b5611ffada69";

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка выполнения запроса:", error);
  }
}

function addDataToSection(sectionSelector, data) {
  const section = document.querySelector(sectionSelector);
  if (!section) {
    console.error("Секция не найдена:", sectionSelector);
    return;
  }

  section.innerHTML = "";

  data.forEach((item) => {
    const block = document.createElement("div");
    block.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>Создано: ${item.created_at}</p>
            <hr>
        `;
    section.appendChild(block);
  });
}
function showGuides(routeId) {
  displayGuides(routeId);
}

async function displayGuides(routeId) {
  const guidesUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routeId}/guides?api_key=${apiKey}`;
  const guidesData = await fetchData(guidesUrl);

  if (guidesData) {
    console.log("Список гидов для маршрута", routeId, ":", guidesData);
    displayGuidesList(guidesData);
  } else {
    console.error("Список гидов не получен.");
  }
}

function displayGuidesList(guides) {
  const guidesListContainer = document.getElementById("guidesList");
  guidesListContainer.innerHTML = "";

  guides.forEach((guide) => {
    const guideItem = document.createElement("div");
    guideItem.innerHTML = `
      <h3>${guide.name}</h3>
      <p>Язык: ${guide.language}</p>
      <p>Цена за час: ${guide.pricePerHour}</p>
      <p>Опыт работы: ${guide.workExperience} лет</p>
      <hr>
    `;
    guidesListContainer.appendChild(guideItem);
  });
}

async function getRoutes() {
  const routesUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${apiKey}`;
  const routesData = await fetchData(routesUrl);

  if (routesData) {
    console.log("Список маршрутов:", routesData);

    if (routesData.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const displayedRoutes = routesData.slice(startIndex, endIndex);

      displayRoutesList(displayedRoutes);
      updatePagination(routesData.length);

      const firstRouteId = displayedRoutes[0].id;
      await displayGuides(firstRouteId);
    }
  } else {
    console.error("Список маршрутов не получен.");
  }
}
getRoutes();

function displayRoutesList(routes) {
  const routesListContainer = document.getElementById("routesList");
  routesListContainer.innerHTML = "";

  routes.forEach((route) => {
    const routeItem = document.createElement("div");
    routeItem.innerHTML = `
            <h3>${route.name}</h3>
            <p>${route.description}</p>
            <p>Создано: ${route.created_at}</p>
            <hr>
        `;
    routesListContainer.appendChild(routeItem);
  });
}

function updatePagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationElement = document.getElementById("pagination");
  paginationElement.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.classList.add("page-item");

    const a = document.createElement("a");
    a.classList.add("page-link");
    a.href = "#";
    a.textContent = i;

    a.addEventListener("click", async () => {
      currentPage = i;
      await getRoutes();
    });

    if (i === currentPage) {
      li.classList.add("active");
    }

    li.appendChild(a);
    paginationElement.appendChild(li);
  }
}

async function getRoutes() {
  const routesUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${apiKey}`;
  const routesData = await fetchData(routesUrl);

  if (routesData) {
    console.log("Список маршрутов:", routesData);

    if (routesData.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const displayedRoutes = routesData.slice(startIndex, endIndex);

      displayRoutesList(displayedRoutes);
      updatePagination(routesData.length);

      const firstRouteId = displayedRoutes[0].id;
      await displayGuides(firstRouteId);
    }
  } else {
    console.error("Список маршрутов не получен.");
  }
}

function selectRoute(routeId) {
  currentPage = 1;
  displayGuides(routeId);
}

function displayRoutesList(routes) {
  const routesListContainer = document.getElementById("routesList");
  routesListContainer.innerHTML = "";

  routes.forEach((route) => {
    const routeItem = document.createElement("div");
    routeItem.innerHTML = `
            <h3>${route.name}</h3>
            <p>${route.description}</p>
            <p>Создано: ${route.created_at}</p>
            <button onclick="selectRoute(${route.id})">Выбрать маршрут</button>
            <hr>
          `;
    routesListContainer.appendChild(routeItem);
  });
}

window.onload = async () => {
  await displayData();
  await getRoutes();
  const currentPageLink = document.querySelector(
    `.pagination .page-item:nth-child(${currentPage}) .page-link`
  );
  if (currentPageLink) {
    currentPageLink.classList.add("active");
  }
};
