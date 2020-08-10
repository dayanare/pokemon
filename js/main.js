$(document).ready(function(){
    var pokemonCounterIndicator = document.querySelector('#pokemon-counter');
    var pokemonCounterIndicator = document.querySelector('#pokemon-counter-in-realtime');
    var pokemonList             = document.querySelector('#pokemon-list');
    var filterPokemonForm       = $('#filterPokemonForm');
    var textSearch              = $('#textSearch');

    pokemonCounterIndicator.innerHTML = 'cargando...';

    var dataList = [];
    var dataFilter = [];
    let pokemonCounter = 0,
        pokemonDataFetchCounter = 0,
        dataModalActive = 0;

    textSearch.keydown(function(e){
        let searchText = textSearch.val();

        setTimeout(() => {
            let filter = dataList.filter(pokemon => pokemon.name.toLowerCase().includes(searchText.toLowerCase()));

            if(filter.length > 0){
                dataFilter = filter;
                renderListPokemon(dataFilter, dataFilter.length);
            }else{
                pokemonList.innerHTML = `
                    <div class="col-12">
                    <div class="container text-center py-4">
                            <h3 class="text-primary"> No se han podido encontrar coincidencias, intente buscar por otro texto ó reinicie los filtros</h3>
                    </div>
                    </div>
                `;
            }
        }, 1000);
    });

    function getCounterAndInitialData () {
        pokemonCounter = 721;
        getAllPokemon();
    }

    function renderListPokemon(data, finalCounter){
        let initialCounter = 0;
        pokemonList.innerHTML = '';
        
        for(i = initialCounter; i < finalCounter; i++){
            let urlImgSprite = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png";
            let urlImg = "https://pokeres.bastionbot.org/images/pokemon/${i}.png";

            let idPkm = data[i].url.split('/')[6];

           

            let pokeCard = `
                    <div class="card w-100 shadow-sm data-pokemon-list">
                        <a href="#pokemonModal" data-toggle="modal" class="card-header btn-modal" data-target="#pokemonModal" data-id="${idPkm}">
                            <img src="https://pokeres.bastionbot.org/images/pokemon/${idPkm}.png" class="img-fluid" alt="${data[i].name}" />
                            <span class="pokemon-id font-weight-bold">ID / ${idPkm}</span> 
                        </a>
                        <div class="card-body">
                            <h4 class="pokemon-name font-weight-bold text-danger mb-0">${data[i].name}</h4>
                        </div>
                    </div>
                `;

            let pokeContainer = document.createElement('div');
                pokeContainer.className = 'col-md-4 pokemon-list-content mb-4';

            pokeContainer.innerHTML = pokeCard;
            pokemonList.appendChild(pokeContainer);
        }

        $('#loader').addClass('d-none');

        $('.data-pokemon-list .btn-modal').click(function(e){
            var id      = $(this).data('id');
            url = `http://pokeapi.salestock.net/api/v2/pokemon/${id}/`;

            var namePokemon = $('#namePokemon');
            var idPokemon   = $('#idPokemon');
            var renderDataPokemon = $('#renderDataPokemon');
            var loaderModal = $('#loader-modal');

            idPokemon.text('ID / '+id);

            if(dataModalActive !== id){

                loaderModal.removeClass('d-none');
                renderDataPokemon.html('');

                dataModalActive = id;

                fetch(url)
                    .then(response => response.json())
                    .then((thisPokemonData) => {

                        let data = thisPokemonData;
                        let renderTypes = '';
                        let urlSpecies = data.species.url;

                        fetch(urlSpecies)
                        .then(response => response.json())
                        .then((thisPokemonDataSpecies) => {

                            function inSpanish(array){
                                return array.language.name === 'es';
                            }

                            let nameInSpanish = thisPokemonDataSpecies.names.filter(inSpanish);
                            let description = thisPokemonDataSpecies.flavor_text_entries.filter(inSpanish);
                            let renderEvolves = ''

                            if(thisPokemonDataSpecies.evolves_from_species !== null){
                                renderEvolves = `
                                    <div>
                                        <hr class="border-info" />
                                        <h4 class="h6 font-weight-bold">Evoluciona de: <span class="text-info">${thisPokemonDataSpecies.evolves_from_species.name}</span></h4>
                                    </div>
                                `;
                            }

                            data.types.forEach(function(type){
                                renderTypes += `<span class="badge badge-light badge-pill">${type['type']['name']}</span>`;
                            });

                            renderDataPokemon.html(`
                                <div class="container-fluid pokemon-data-modal">
                                    <div class="row">
                                        <div class="col-md-3 text-center bg-light py-3">
                                            <h5 class="h5 font-weight-bold text-center">
                                                Sprites
                                            </h5>
                                            <img 
                                            src="https://pokeres.bastionbot.org/images/pokemon/${data.id}.png" 
                                            class="img-fluid pokemon-img" 
                                            alt="${nameInSpanish.name}" />
                                            <img 
                                            src="${data.sprites.back_default}" 
                                            class="img-fluid pokemon-img d-none" 
                                            alt="${data.name}" />
                                        </div>
                                        <div class="col-md-9 py-3">
                                            <h4>Nombre: <span class="text-danger font-weight-bold">${data.name}</span></h4>
                                            <p>${description[0].flavor_text}</p>
                                            <p class="mb-0">Experiencia base: <span class="font-weight-bold">${data.base_experience}</span></p>
                                            <p class="mb-3">Altura: <span class="font-weight-bold">${data.height}</span></p>
                                            <div class="pokemon-types">
                                                <h5>Tipo:</h5>
                                                ${renderTypes}
                                            </div>
                                            <div class="evolves">
                                                ${renderEvolves}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `);

                            loaderModal.addClass('d-none');
                        });
                    });
            }
        });
    }

    function getAllPokemon(){
        url = `http://pokeapi.salestock.net/api/v2/pokemon/?limit=${pokemonCounter}`;

        fetch(url)
        .then(response => response.json())
            .then((data) => {
                dataList = data.results;
                renderListPokemon(dataList, dataList.length);
            });
    }

    getCounterAndInitialData();
});