export class VueJs {

    static init() {

        // config
        Vue.config.delimiters = ['${', '}'];

        new Vue({
            el: '#app',
            data: {
                pageTitle: "Mardizza !!!"
            }
        });
    }
}