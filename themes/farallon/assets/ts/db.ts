class FARALLON_DOUBAN {
    ver: string;
    type: any;
    finished: boolean;
    paged: number;
    genre_list: Array<any>;
    subjects: Array<any>;
    genre: Array<any>;
    baseAPI: string = "https://node.wpista.com/v1/outer/";
    token: string;

    constructor(config: any) {
        this.ver = "1.0.1";
        this.type = "movie";
        this.finished = false;
        this.paged = 1;
        this.genre_list = [];
        this.genre = [];
        this.subjects = [];
        this.token = config.token;
        this._create();
    }

    on(t: any, e: any, n: any) {
        var a = document.querySelectorAll(e);
        a.forEach((item) => {
            item.addEventListener(t, n);
        });
    }

    _fetchGenres() {
        document.querySelector(".db--genres")!.innerHTML = "";
        fetch(
            this.baseAPI + "genres?token=" + this.token + "&type=" + this.type
        )
            .then((response) => response.json())
            .then((t) => {
                // @ts-ignore
                if (t.data.length) {
                    this.genre_list = t.data;
                    this._renderGenre();
                }
            });
    }

    _handleGenreClick() {
        this.on("click", ".db--genreItem", (t: any) => {
            const self = t.currentTarget as HTMLElement;
            if (self.classList.contains("is-active")) {
                const index = this.genre.indexOf(self.innerText);
                self.classList.remove("is-active");
                this.genre.splice(index, 1);
                this.paged = 1;
                this.finished = false;
                this.subjects = [];
                this._fetchData();
                return;
            }
            document.querySelector(".db--list")!.innerHTML = "";
            document.querySelector(".lds-ripple")!.classList.remove("u-hide");

            self.classList.add("is-active");
            this.genre.push(self.innerText);
            this.paged = 1;
            this.finished = false;
            this.subjects = [];
            this._fetchData();
            return;
        });
    }

    _renderGenre() {
        document.querySelector(".db--genres")!.innerHTML = this.genre_list
            .map((item: any) => {
                return `<span class="db--genreItem${
                    this.genre_list.includes(item.name) ? " is-active" : ""
                }">${item.name}</span>`;
            })
            .join("");
        this._handleGenreClick();
    }

    _fetchData() {
        fetch(
            this.baseAPI +
                "faves?token=" +
                this.token +
                "&type=" +
                this.type +
                "&paged=" +
                this.paged +
                "&genre=" +
                JSON.stringify(this.genre)
        )
            .then((response) => response.json())
            .then((t: any) => {
                if (t.data.length) {
                    if (
                        document
                            .querySelector(".db--list")!
                            .classList.contains("db--list__card")
                    ) {
                        this.subjects = [...this.subjects, ...t.data];
                        this._randerDateTemplate();
                    } else {
                        this.subjects = [...this.subjects, ...t.data];
                        this._randerListTemplate();
                    }
                    document
                        .querySelector(".lds-ripple")!
                        .classList.add("u-hide");
                } else {
                    this.finished = true;
                    document
                        .querySelector(".lds-ripple")!
                        .classList.add("u-hide");
                }
            });
    }

    _randerDateTemplate() {
        const result = this.subjects.reduce((result, item) => {
            const date = new Date(item.create_time);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const key = `${year}-${month.toString().padStart(2, "0")}`;
            if (Object.prototype.hasOwnProperty.call(result, key)) {
                result[key].push(item);
            } else {
                result[key] = [item];
            }
            return result;
        }, {});

        let html = ``;
        for (let key in result) {
            const date = key.split("-");
            html += `<div class="db--listBydate"><div class="db--titleDate "><div class="db--titleDate__day">${date[1]}</div><div class="db--titleDate__month">${date[0]}</div></div><div class="db--dateList__card">`;
            html += result[key]
                .map((movie: any) => {
                    return `<div class="db--item">${
                        movie.is_top250
                            ? '<span class="top250">Top 250</span>'
                            : ""
                    }<img src="${
                        movie.poster
                    }" referrerpolicy="no-referrer" class="db--image"><div class="db--score ">${
                        movie.douban_score > 0
                            ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" ><path d="M12 20.1l5.82 3.682c1.066.675 2.37-.322 2.09-1.584l-1.543-6.926 5.146-4.667c.94-.85.435-2.465-.799-2.567l-6.773-.602L13.29.89a1.38 1.38 0 0 0-2.581 0l-2.65 6.53-6.774.602C.052 8.126-.453 9.74.486 10.59l5.147 4.666-1.542 6.926c-.28 1.262 1.023 2.26 2.09 1.585L12 20.099z"></path></svg>' +
                              movie.douban_score
                            : ""
                    }${
                        movie.year > 0 ? " · " + movie.year : ""
                    }</div><div class="db--title"><a href="${
                        movie.link
                    }" target="_blank">${movie.name}</a></div></div>`;
                })
                .join("");
            html += `</div></div>`;
        }
        document.querySelector(".db--list")!.innerHTML = html;
    }

    _randerListTemplate() {
        document.querySelector(".db--list")!.innerHTML = this.subjects
            .map((item: any) => {
                return `<div class="db--item">${
                    item.is_top250 ? '<span class="top250">Top 250</span>' : ""
                }<img src="${
                    item.poster
                }" referrerpolicy="no-referrer" class="db--image"><div class="ipc-signpost ">${
                    item.create_time
                }</div><div class="db--score ">${
                    item.douban_score > 0
                        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" ><path d="M12 20.1l5.82 3.682c1.066.675 2.37-.322 2.09-1.584l-1.543-6.926 5.146-4.667c.94-.85.435-2.465-.799-2.567l-6.773-.602L13.29.89a1.38 1.38 0 0 0-2.581 0l-2.65 6.53-6.774.602C.052 8.126-.453 9.74.486 10.59l5.147 4.666-1.542 6.926c-.28 1.262 1.023 2.26 2.09 1.585L12 20.099z"></path></svg>' +
                          item.douban_score
                        : ""
                }${
                    item.year > 0 ? " · " + item.year : ""
                }</div><div class="db--title"><a href="${
                    item.link
                }" target="_blank">${item.name}</a></div>
                </div>
                </div>`;
            })
            .join("");
    }

    _handleScroll() {
        window.addEventListener("scroll", () => {
            var t = window.scrollY || window.pageYOffset;
            const moreElement = document.querySelector(
                ".block-more"
            ) as HTMLElement;
            if (
                moreElement.offsetTop + -window.innerHeight < t &&
                document
                    .querySelector(".lds-ripple")!
                    .classList.contains("u-hide") &&
                !this.finished
            ) {
                document
                    .querySelector(".lds-ripple")!
                    .classList.remove("u-hide");
                this.paged++;
                this._fetchData();
            }
        });
    }

    _handleNavClick() {
        this.on("click", ".db--navItem", (t: any) => {
            if (t.currentTarget.classList.contains("current")) return;
            this.genre = [];
            this.type = t.currentTarget.dataset.type;
            if (this.type != "book") {
                this._fetchGenres();
                document
                    .querySelector(".db--genres")
                    ?.classList.remove("u-hide");
            } else {
                document.querySelector(".db--genres")!.classList.add("u-hide");
            }
            document.querySelector(".db--list")!.innerHTML = "";
            document.querySelector(".lds-ripple")!.classList.remove("u-hide");
            document
                .querySelector(".db--navItem.current")!
                .classList.remove("current");
            const self = t.target;
            self.classList.add("current");
            this.paged = 1;
            this.finished = false;
            this.subjects = [];
            this._fetchData();
        });
    }

    _create() {
        if (document.querySelector(".db--container")) {
            const container = document.querySelector(
                ".db--container"
            ) as HTMLElement;
            if (container.dataset.token) {
                this.token = container.dataset.token;
            } else {
                return;
            }
            const currentNavItem = document.querySelector(
                ".db--navItem.current"
            );
            if (currentNavItem instanceof HTMLElement) {
                this.type = currentNavItem.dataset.type;
            }
            const currentType = document.querySelector(
                ".db--list"
            ) as HTMLElement;
            if (currentType.dataset.type) this.type = currentType.dataset.type;
            if (this.type == "movie") {
                document
                    .querySelector(".db--genres")!
                    .classList.remove("u-hide");
            }
            this._fetchGenres();
            this._fetchData();
            this._handleScroll();
            this._handleNavClick();
        }

        if (document.querySelector(".js-db")) {
            document.querySelectorAll(".js-db").forEach((item: any) => {
                const db = item;
                const id = db.dataset.id;
                const type = db.dataset.type;
                const nodeParent = db.parentNode as HTMLElement;
                fetch(
                    // @ts-ignore
                    this.baseAPI + `${type}/${id}?token=${this.token}`
                ).then((response) => {
                    response.json().then((t) => {
                        if (t.data) {
                            const data = t.data;
                            const node = document.createElement("div");
                            node.classList.add("doulist-item");
                            node.innerHTML = `<div class="doulist-subject">
                            <div class="doulist-post"><img decoding="async" referrerpolicy="no-referrer" src="${data.poster}"></div>
                            <div class="doulist-content">
                            <div class="doulist-title"><a href="${data.link}" class="cute" target="_blank" rel="external nofollow">${data.name}</a></div>
                            <div class="rating"><span class="allstardark"><span class="allstarlight" style="width:55%"></span></span><span class="rating_nums"> ${data.douban_score} </span></div>
                            <div class="abstract">${data.card_subtitle}</div>
                            </div>
                            </div>`;
                            nodeParent.replaceWith(node);
                        }
                    });
                });
            });
        }

        if (document.querySelector(".db--collection")) {
            document
                .querySelectorAll(".db--collection")
                .forEach((item: any) => {
                    this._fetchCollection(item);
                });
        }
    }

    _fetchCollection(item: any) {
        const type = item.dataset.style ? item.dataset.style : "card";
        fetch(
            // @ts-ignore
            obvInit.api +
                "v1/movies?type=" +
                item.dataset.type +
                "&paged=1&genre=&start_time=" +
                item.dataset.start +
                "&end_time=" +
                item.dataset.end
        )
            .then((response) => response.json())
            .then((t: any) => {
                if (t.length) {
                    if (type == "card") {
                        item.innerHTML += t
                            .map((movie: any) => {
                                return `<div class="doulist-item">
                            <div class="doulist-subject">
                            <div class="db--viewTime ">Marked ${
                                movie.create_time
                            }</div>
                            <div class="doulist-post"><img referrerpolicy="no-referrer" src="${
                                movie.poster
                            }"></div><div class="doulist-content"><div class="doulist-title"><a href="${
                                    movie.link
                                }" class="cute" target="_blank" rel="external nofollow">${
                                    movie.name
                                }</a></div><div class="rating"><span class="allstardark"><span class="allstarlight" style="width:75%"></span></span><span class="rating_nums">${
                                    movie.douban_score
                                }</span></div><div class="abstract">${
                                    movie.remark || movie.card_subtitle
                                }</div></div></div></div>`;
                            })
                            .join("");
                    } else {
                        const result = t.reduce((result: any, item: any) => {
                            if (
                                Object.prototype.hasOwnProperty.call(
                                    result,
                                    item.create_time
                                )
                            ) {
                                result[item.create_time].push(item);
                            } else {
                                result[item.create_time] = [item];
                            }
                            return result;
                        }, {});
                        let html = ``;
                        for (let key in result) {
                            html += `<div class="db--date">${key}</div><div class="db--dateList">`;
                            html += result[key]
                                .map((movie: any) => {
                                    return `<div class="db--card__list"">
                                    <img referrerpolicy="no-referrer" src="${
                                        movie.poster
                                    }">
                                    <div>
                                    <div class="title"><a href="${
                                        movie.link
                                    }" class="cute" target="_blank" rel="external nofollow">${
                                        movie.name
                                    }</a></div>
                                    <div class="rating"><span class="allstardark"><span class="allstarlight" style="width:75%"></span></span><span class="rating_nums">${
                                        movie.douban_score
                                    }</span></div>
                                    ${movie.remark || movie.card_subtitle}
                                    </div>
                                    </div>`;
                                })
                                .join("");
                            html += `</div>`;
                        }
                        item.innerHTML = html;
                    }
                }
            });
    }
}

new FARALLON_DOUBAN({
    // @ts-ignore
    token: window.WPD_TOKEN,
});
