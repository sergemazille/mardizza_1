import {Dom} from './Dom';
import {Event} from './Event';
import * as constantes from './constantes';

export class groupConfigVue {

    static init() {

        let vm = new Vue({
            el: '#group-config',
            props: ['group'],
            data: {
                csrf: '',
                adminIds: [],
                tmpImage: '',
                invitationOn: false,
                mailTo: '',
            },
            methods: {
                userIsLastMember(){
                    return this.group.members.length <= 1;
                },
                userIsLastAdmin(){
                    return this.adminIds.length <= 1;
                },
                updateImageThumbnail() {
                    let that = this;
                    if (this.$els.fileinput.files[0]) {
                        if(this.imageIsValid()) {
                            let image = this.$els.fileinput.files[0];
                            let reader  = new FileReader();
                            reader.readAsDataURL(image);
                            reader.onloadend = function () {
                                that.group.imageUrl = reader.result;
                            };
                        }
                    }
                },
                updateGroup() {
                    if(this.formDataIsValid()){
                        this.submitForm();
                    }
                },
                submitForm(){
                    // form submission
                    let formData = new FormData();

                    formData.append('csrf', this.csrf);
                    formData.append('image', this.$els.fileinput.files[0]);
                    formData.append('name', this.group.name);
                    formData.append('color', this.group.color);
                    formData.append('stamps', this.group.stamps);
                    formData.append('members', JSON.stringify(this.group.members));
                    formData.append('adminIds', this.adminIds);

                    this.$http.post(`/group/update/${this.group.id}`, formData)
                        .then(
                            // success
                            function (response) {
                                if (response.data == "ok") {
                                    // redirect back to user groups
                                    window.location = '/groups';
                                }else{
                                    Dom.createNotification(response.data, constantes.ALERT_ERROR);
                                }
                            },
                            // error
                            function () {
                                Dom.createNotification(constantes.messages.ERROR_MESSAGE, constantes.ALERT_ERROR);
                            }
                        ).bind(this);
                },
                formDataIsValid(){
                    // test image size and mime type
                    if (this.$els.fileinput.files[0]) {
                        if(! this.imageIsValid()) {
                            return false;
                        }
                    }

                    // test there's at least one admin
                    if (this.adminIds.length <= 0) {
                        Dom.createNotification(constantes.messages.ONE_ADMIN, constantes.ALERT_ERROR);
                        return false;
                    }

                    // if every test is valid then send ok to keep going on with form submission
                    return true;
                },
                imageIsValid() {
                    let imageSize = this.$els.fileinput.files[0].size;
                    if (imageSize > 100000) {
                        Dom.createNotification(constantes.messages.IMAGE_SIZE, constantes.ALERT_ERROR);
                        return false;
                    }

                    let imageMimeType = this.$els.fileinput.files[0].type;
                    if (imageMimeType != 'image/png' && imageMimeType != 'image/jpeg' && imageMimeType != 'image/gif') {
                        Dom.createNotification(constantes.messages.IMAGE_FORMAT, constantes.ALERT_ERROR);
                        return false;
                    }

                    // if image is valid then return true
                    return true;
                },
                sendInvitation() {
                    if(! this.emailIsValid()) {
                        Dom.createNotification(constantes.messages.EMPTY_EMAIL_ADDRESS, constantes.ALERT_ERROR);
                    }

                    let formData = new FormData();
                    formData.append('csrf', this.csrf);
                    formData.append('mailTo', this.mailTo);

                    this.$http.post(`/invitation/group/${this.group.id}`, formData)
                        .then(
                            // success
                            function (response) {
                                if (response.data == "ok") {
                                    Dom.createNotification(constantes.messages.INVITATION_SENT, constantes.ALERT_SUCCESS);
                                }else{
                                    Dom.createNotification(response.data, constantes.ALERT_ERROR);
                                }
                            },
                            // error
                            function () {
                                Dom.createNotification(constantes.messages.ERROR_MESSAGE, constantes.ALERT_ERROR);
                            }
                        ).bind(this);

                },
                emailIsValid() {
                    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return emailRegex.test(this.mailTo)
                },
                quitGroup(){
                    let formData = new FormData();
                    formData.append('csrf', this.csrf);

                    this.$http.post(`/group/quit/${this.group.id}`, formData)
                        .then(
                            // success
                            function (response) {
                                if (response.data == "ok") {
                                    // redirect back to user groups
                                    window.location = '/groups';
                                } else {
                                    Dom.createNotification(response.data, constantes.ALERT_ERROR);
                                }
                            },
                            // error
                            function () {
                                Dom.createNotification(constantes.messages.ERROR_MESSAGE, constantes.ALERT_ERROR);
                            }
                        ).bind(this);
                },
                deleteGroup(){
                    let formData = new FormData();
                    formData.append('csrf', this.csrf);

                    this.$http.post(`/group/delete/${this.group.id}`, formData)
                        .then(
                            // success
                            function (response) {
                                if (response.data == "ok") {
                                    // redirect back to user groups
                                    window.location = '/groups';
                                } else {
                                    Dom.createNotification(response.data, constantes.ALERT_ERROR);
                                }
                            },
                            // error
                            function (response) {
                                console.log(response);
                                Dom.createNotification(constantes.messages.ERROR_MESSAGE, constantes.ALERT_ERROR);
                            }
                        ).bind(this);
                },
                openInvitation() {
                    this.invitationOn = !this.invitationOn;
                },
            },
            watch : {
                'tmpImage' : function(){
                    this.updateImageThumbnail();
                }
            }
        });
    }
}