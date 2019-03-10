(function () {
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
  const INDEX_URL = BASE_URL + '/api/v1/users/'
  const dataPanel = document.getElementById('data-panel')
  const data = []
  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')
  let page = 1
  let paginationData = []
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 16
  const favorite = document.getElementById('favorite')
  const homepage = document.getElementById('homepage')

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    getTotalPages(data)
    getPageData(1, data)
  }).catch((err) => console.log(err))

  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-user')) {
      showUser(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    } else if (event.target.matches('.btn-remove-favorite')) {
      removeFavoriteItem(event.target.dataset.id)
    }
  })

  searchBtn.addEventListener('click', event => {
    let results = []
    event.preventDefault()
    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(user => user.name.match(regex))
    getTotalPages(results)
    getPageData(1, results)
  })

  pagination.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

  favorite.addEventListener('click', event => {
    const data = JSON.parse(localStorage.getItem('favoriteUsers')) || []
    page = favorite
    getTotalPages(data)
    getPageData(1, data)
  })

  homepage.addEventListener('click', event => {
    page = 1
    getTotalPages(data)
    getPageData(1, data)
  })

  function displayDataList(data) {
    let htmlContent = ''

    if (page === favorite) {
      data.forEach(function (item, index) {
        htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top" src="${item.avatar}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.name}</h6>
            </div>
            <!-- "Info" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-user" data-toggle="modal" data-target="#show-user-modal" data-id="${item.id}">Info</button>
              <!-- favorite button --> 
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      `
      })
    } else {
      data.forEach(function (item, index) {
        htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top" src="${item.avatar}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.name}</h6>
            </div>
            <!-- "Info" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-user" data-toggle="modal" data-target="#show-user-modal" data-id="${item.id}">Info</button>
              <!-- favorite button --> 
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
      })
    }
    dataPanel.innerHTML = htmlContent
  }

  function showUser(id) {
    const modalImage = document.getElementById('show-user-image')
    const modalDescription = document.getElementById('show-user-description')

    const url = INDEX_URL + id
    axios.get(url).then(response => {
      const data = response.data
      modalImage.innerHTML = `<img src="${data.avatar}" class="img-fluid" alt="Responsive image">`
      modalDescription.innerHTML = `
          <h3>${data.name} ${data.surname}</h3>
          <p>@${data.region}</p>
          <br>
          <p>${data.birthday}</p>
          <p>${data.email}</p>
        `
    })
  }

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
    const user = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${user.name} is already in your favorite list.`)
    } else {
      list.push(user)
      alert(`Added ${user.name} to your favorite list!`)
    }
    localStorage.setItem('favoriteUsers', JSON.stringify(list))
  }

  function removeFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
    const index = list.findIndex(item => item.id === Number(id))
    const user = data.find(item => item.id === Number(id))

    if (index === -1) return
    list.splice(index, 1)
    localStorage.setItem('favoriteUsers', JSON.stringify(list))
    alert(`Removed ${user.name} from your favorite list!`)
    if (page === favorite) {
      getPageData(1, list)
    }
  }

})()