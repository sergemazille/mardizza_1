export class groupsVue {

    static init() {
        Vue.component('group', {
            template: '#group-template',
            props: ['group'],
        });

        let vm = new Vue({
            el: '#groups',
            data: {
                groups: [],
            },
            methods: {
                getGroups(){
                    $.get('/get/groups', function (groups) {
                        console.log(groups);
                        this.groups = groups;
                    }.bind(this));
                },
            },
            ready(){
                // hydrate with ajax calls
                this.getGroups();
            }
        });
    }
}