import {Dom} from './Dom';
import {Event} from './Event';
import * as constantes from './constantes';

export class groupsVue {

    static init() {

        Vue.component('group', {
            template: '#group-template',
            props: ['group'],
            methods: {
                groupConfig(){
                    console.log(this.group.id);
                },
                orderLink() {
                    window.location = `/order/group/${this.group.id}`;
                },
            },
        });

        let vm = new Vue({
            el: '#groups',
            data: {
                groups: [],
                csrf: '',
            },
            methods: {
                getGroups(){
                    $.get('/get/groups', function (groups) {
                        this.groups = groups;

                        // wait for groups to be loaded
                        this.$nextTick(function () {
                            this.launchScripts();
                        });
                    }.bind(this));
                },
                launchScripts(){
                    Event.animations();
                },
                createGroup(){
                    let formData = new FormData();
                    formData.append('csrf', this.csrf);

                    this.$http.post('/group/create', formData)
                        .then(
                            // success
                            function (response) {
                                if (response.body == "ok") {
                                    Dom.createNotification(constantes.messages.GROUP_CREATED, constantes.ALERT_SUCCESS);
                                    this.getGroups();
                                } else {
                                    Dom.createNotification(response.body, constantes.ALERT_ERROR);
                                }
                            },
                            // error
                            function (response) {
                                console.log(response);
                                Dom.createNotification(response.body, constantes.ALERT_ERROR);
                            }
                        ).bind(this);
                },
            },
            ready(){
                // hydrate with ajax calls
                this.getGroups();
            }
        });
    }
}