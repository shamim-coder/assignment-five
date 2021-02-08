



// Call APIs
const searchHandler = () => {
    const searchInput = document.getElementById('search-input')
    document.getElementById('single-preview').innerHTML = ''
    const searchValue = searchInput.value
    let api = '';

    // Search Recipe by first letter
    if (searchValue.length === 1 ) {
        api = `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchValue}`;
    }
    // Search Recipe by name
    else if (searchValue.length > 1) {
        api = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`;
    }

    fetch(api)
        .then(response => response.json())
        .then(data => getRecipes(data.meals))
        .catch((error) => getErrorMessage("Uh oh. We didn't find the recipes that you were looking for."));
}

// get all recipes by search
const getRecipes = (recipes) => {
    document.getElementById('recipe-container').innerHTML = ''
    const recipeContainer = document.getElementById('recipe-container')
    
    recipes.forEach(recipe => {
        const { strMeal, strMealThumb, idMeal } = recipe
        const recipeTemplate =`
            <a onclick="getRecipeDetails(${idMeal})" href="javascript:void(0)"><div class="card h-100">
                <img src="${strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body bg-light text-dark">
                    <h5 class="card-title fw-bold">${strMeal}</h5>
                </div>
            </div></a>`

        recipeContainer.innerHTML += recipeTemplate
    })

    // display total number of meal are found as shown 
    const searchCount = recipes.length
    const searchResult = document.getElementById('search-result')
    const searchValue = document.getElementById('search-input').value
    const searchResultCount = 
    `<div class="card-body bg-light text-dark rounded my-5">
        <p class="card-title">${searchCount} recipe results for "${searchValue}"</p>
    </div>`
    searchResult.innerHTML = searchResultCount

    // search input value default
    document.getElementById('search-input').value = '';
}

// Error Message Display
const getErrorMessage = (error) => {
    const searchResult = document.getElementById('search-result')
    const recipeContainer = document.getElementById('recipe-container')
    const errorMessage =
        `<div class="card-body bg-light text-dark mb-4">
            <p class="card-title">${error}</p>
        </div>`
    searchResult.innerHTML = errorMessage
    recipeContainer.innerHTML = ""
}

// Lookup full meal details by id
const getRecipeDetails = (id) => {
    document.getElementById('single-preview').style.display = "inline-flex";
    
    const api = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    fetch(api)
        .then((response) => response.json())
        .then((data) => singlePreview(data.meals))
        .catch((error) => getErrorMessage("Something is wrong! Please try again letter"));
}

// Get Single Recipe Details
const singlePreview = (recipes) => {
    
    const recipe = recipes[0]
    const {strMealThumb, strMeal} = recipe

    const ingredient = []

    for (let i = 1; i < 20; i++) {
        if(recipe[`strIngredient${i}`]) {
            ingredient.push(`
                ${recipe[`strMeasure${i}`]}  ${recipe[`strIngredient${i}`]}
            `)
        } else {
            break;
        }
    }
      
    const singleContainer = document.getElementById('single-preview');

    // Get Measurement and Ingredient
    const singlePreviewHtml =
        `<div class="col-md-6 mb-5"> 
            <img class="thumb" src="${strMealThumb}" alt="">
        </div>

        <div class="col-md-5 offset-md-1"> 
            <h2 class="fw-bold mb-4">${strMeal}</h2>
            <h5 class="fw-bold mb-4">Ingredients: </h5>
            <ul class="list-group">
                ${ingredient.map(e => `<li> <i class="fas fa-check-square"></i>${e}</li>`).join('')}
            </ul>
        </div>`

    singleContainer.innerHTML = singlePreviewHtml;
}
