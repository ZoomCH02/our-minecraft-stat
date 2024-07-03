function onYouTubeIframeAPIReady() {
    // Do nothing here, we'll create players dynamically
}

function createYouTubePlayer(playerId, videoId) {
    new YT.Player(playerId, {
        videoId: videoId,
        width: '100%',
        height: '350px',
        playerVars: {
            'autoplay': 0,
            'controls': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // Optional: event.target.playVideo();
}

function onPlayerStateChange(event) {
    // Optional: handle player state changes
}

function getInfo() {
    fetch('/getSeasons')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Обработка полученных данных
            console.log('Список сезонов:', data);

            data.forEach(season => {
                season.id = parseInt(season.id); // Преобразуем строку id в число
            });

            // Сортировка данных по убыванию id
            data.sort((a, b) => b.id - a.id);

            // Создание HTML для каждого сезона
            let seasonsHTML = '';
            data.forEach(season => {
                seasonsHTML += `
                <!-- Details 2 -->
                <div class="py-24">
                    <div class="container px-4 sm:px-8 lg:grid lg:grid-cols-12 lg:gap-x-12">
                        <div class="lg:col-span-7">
                            <div class="mb-12 lg:mb-0 xl:mr-14">
                                <img class="inline" src="images/${season.img}" alt="alternative" />
                            </div>
                        </div> <!-- end of col -->
                        <div class="lg:col-span-5">
                            <div class="xl:mt-12">
                                <h2 class="mb-6">${season.name}(${season.ver})</h2>
                                <a class="btn-solid-reg popup-with-move-anim mr-1.5" href="#details-lightbox${season.id}">Подробнее</a>
                            </div>
                        </div> <!-- end of col -->
                    </div> <!-- end of container -->
                </div>
                <!-- end of details 2 -->
                
                <!-- Details Lightbox -->
                <!-- Lightbox -->
                <div id="details-lightbox${season.id}" class="lightbox-basic zoom-anim-dialog mfp-hide">
                    <div class="lg:grid lg:grid-cols-12 lg:gap-x-8">
                        <button title="Close (Esc)" type="button" class="mfp-close x-button">×</button>
                        <div class="lg:col-span-8">
                            <div class="mb-12 text-center lg:mb-0 lg:text-left xl:mr-6">
                               <div id="youtube_player_${season.id}"></div>
                            </div>
                        </div> <!-- end of col -->
                        <div class="lg:col-span-4">
                            <h3 class="mb-2">${season.name}</h3>
                            <hr class="w-18 h-0.5 mt-0.5 mb-4 ml-0 border-none bg-indigo-400" />
                            <ul class="list mb-6 space-y-2">
                                <li class="flex">
                                    <i class="fas fa-chevron-right"></i>
                                    <div>Версия: ${season.ver}</div>
                                </li>
                                <li class="flex">
                                    <i class="fas fa-chevron-right"></i>
                                    <div>Координаты острова: ${season.cords}</div>
                                </li>
                                <li class="flex">
                                <i class="fas fa-chevron-right"></i>
                                <div>Игроки сезона: ${season.players}</div>
                                </li>
                            </ul>
                            <a id="butDownload${season.id}" class="btn-solid-reg mfp-close page-scroll" target="__blank" href="${season.file}">Скачать мир</a>
                            <button class="btn-outline-reg mfp-close as-button" type="button">Назад</button>
                        </div> <!-- end of col -->
                    </div> <!-- end of row -->
                </div> <!-- end of lightbox-basic -->
                <!-- end of lightbox -->
                <!-- end of details lightbox -->
                `;
            });

            // Добавление HTML в элемент seasons_list
            document.getElementById('seasons_list').innerHTML = seasonsHTML;

            // Инициализация Magnific Popup на новых элементах
            $('.popup-with-move-anim').magnificPopup({
                type: 'inline',
                fixedContentPos: true,
                fixedBgPos: true,
                overflowY: 'auto',
                closeBtnInside: true,
                preloader: false,
                midClick: true,
                removalDelay: 300,
                mainClass: 'my-mfp-slide-bottom'
            });

            // Создание YouTube плееров для каждого сезона
            data.forEach(season => {
                if (season.video == "-") {
                    var image = document.getElementById("youtube_player_" + season.id)
                    image.innerHTML = `<img src="./images/novid.png">`
                }
                else {
                    createYouTubePlayer(`youtube_player_${season.id}`, season.video);
                }

                if (season.file == null) {
                    var a = document.getElementById(`butDownload${season.id}`)
                    a.setAttribute("style", `pointer-events: none;
                    background-color: grey;
                    text-decoration: none;
                    cursor: default;
                    background-color: grey;`)
                }
            });

        })
        .catch(error => {
            console.error('Ошибка получения данных:', error);
            // Дополнительная обработка ошибок при получении данных
        });
}