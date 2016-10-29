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
            },
            methods: {
                userIsLastMember(){
                    return this.group.members.length <= 1;
                },
                userIsLastAdmin(){
                    return this.adminIds.length <= 1;
                },
                updateGroup() {
                    this.submitForm();
                    // TODO
                    // if nothing has changed the form isn't submitted
                },
                submitForm(){
                    // form submission
                    let formData = new FormData();

                    console.dir(this.group.members);

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
                                } else {
                                    Dom.createNotification(constantes.messages.ERROR_MESSAGE, constantes.ALERT_ERROR);
                                }
                            },
                            // error
                            function () {
                                Dom.createNotification(constantes.messages.ERROR_MESSAGE, constantes.ALERT_ERROR);
                            }
                        ).bind(this);
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
                                    Dom.createNotification(response.body, constantes.ALERT_ERROR);
                                }
                            },
                            // error
                            function (response) {
                                console.log(response.body);
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
                                    Dom.createNotification(constantes.messages.ERROR_MESSAGE, constantes.ALERT_ERROR);
                                }
                            },
                            // error
                            function (response) {
                                console.log(response);
                                Dom.createNotification(constantes.messages.ERROR_MESSAGE, constantes.ALERT_ERROR);
                            }
                        ).bind(this);
                },
                revertChanges(){
                    console.log('hello');

                }
            }
        });

        // Vue.component('group', {
        //     template: '#group-template',
        //     props: ['group'],
        //     data(){
        //         return {
        //             tempName: this.group.name,
        //             tempColor: this.group.color,
        //             tempStamps: this.group.stamps,
        //             tempImageUrl: this.group.imageUrl,
        //             tempAdminIds: this.adminIds,
        //             newImageFlag: "", // used to check if image input has been changed or not
        //             adminIds: [],
        //             csrf: '',
        //             user: '',
        //             invitationOn: false,
        //             mailTo: [],
        //         }
        //     },
        //     methods: {
        //         revertChanges() {
        //             this.group.name = this.tempName;
        //             this.group.color = this.tempColor;
        //             this.group.stamps = this.tempStamps;
        //             this.group.imageUrl = this.tempImageUrl;
        //             // this.adminIds = this.tempAdminIds;
        //         },
        //         saveState() {
        //             this.tempName = this.group.name;
        //             this.tempColor = this.group.color;
        //             this.tempStamps = this.group.stamps;
        //             this.tempImageUrl = this.group.imageUrl;
        //             this.tempAdminIds = this.adminIds;
        //         },
        //         getImageFromImageUrl(imageUrl){
        //             let tmp = imageUrl.split('/');
        //             return tmp.slice(-1).pop();
        //         },
        //         stateHasChanged(){
        //             return (this.group.name != this.tempName ||
        //             this.group.color != this.tempColor ||
        //             this.group.stamps != this.tempStamps ||
        //             this.group.imageUrl != this.tempImageUrl ||
        //             this.adminIds != this.tempAdminIds ||
        //             this.newImageFlag != '');
        //         },

        //         showConfirmation(){
        //             // show confirmation modal
        //             $("#confirmation_modal_"+this.group.id).modal("show");
        //         },

        //         createGroup() {
        //             $.post("/group/create")
        //                 .done(function () {
        //                     Dom.createNotification('Le groupe a bien été créé', constantes.ALERT_SUCCESS);
        //                 })
        //                 .error(function (data) {
        //                     console.log(data);
        //                     Dom.createNotification(data, constantes.ALERT_ERROR);
        //                 });
        //         },
        //         formDataIsValid(){
        //             // test image size isn't greater than 1Mo and is an actual image
        //             if (this.$els.fileinput.files[0]) {
        //
        //                 let imageSize = this.$els.fileinput.files[0].size;
        //                 if (imageSize > 100000) {
        //                     Dom.createNotification(constantes.messages.IMAGE_SIZE, constantes.ALERT_ERROR);
        //                     return false;
        //                 }
        //
        //                 let imageMimeType = this.$els.fileinput.files[0].type;
        //                 if (imageMimeType != 'image/png' && imageMimeType != 'image/jpeg' && imageMimeType != 'image/gif') {
        //                     Dom.createNotification(constantes.messages.IMAGE_FORMAT, constantes.ALERT_ERROR);
        //                     return false;
        //                 }
        //             }
        //
        //             // test there's at least one admin
        //             if (this.adminIds.length <= 0) {
        //                 Dom.createNotification(constantes.messages.ONE_ADMIN, constantes.ALERT_ERROR);
        //                 return false;
        //             }
        //
        //             // if every test is valid then send ok to keep going on with form submission
        //             return true;
        //         },
        //         // revert changes on modal dismissal if nothing has been saved
        //         revertStateOnModalDismissal(){
        //             let self = this;
        //             vm.$nextTick(function () {
        //
        //                 // revert when click outside modal content
        //                 $(".modal.fade").on('click', function (e) {
        //                     if (e.target == this) {
        //                         self.revertChanges();
        //                     }
        //                 });
        //
        //                 // revert when ESC key pressed
        //                 $(document).keyup(function (e) {
        //                     if (e.keyCode == 27) { // escape key maps to keycode `27`
        //                         self.revertChanges();
        //                     }
        //                 });
        //             });
        //         },
        //         openInvitation(){
        //             this.invitationOn = true;
        //         },
        //         sendInvitation(){
        //             let formData = new FormData();
        //
        //             formData.append('csrf', this.csrf);
        //             formData.append('mailTo', this.mailTo);
        //
        //             this.$http.post('/group/invitation', formData)
        //                 .then(
        //                     // success
        //                     function (response) {
        //                         if (response.body == "ok") {
        //                             Dom.hideModal();
        //                             Dom.createNotification(constantes.messages.INVITATION_SENT, constantes.ALERT_SUCCESS);
        //                             this.mailTo = [];
        //                         } else {
        //                             Dom.createNotification('marche pas...', constantes.ALERT_ERROR);
        //                             // Dom.createNotification(constantes.messages.ERROR_MESSAGE, constantes.ALERT_ERROR);
        //                         }
        //                     },
        //                     // error
        //                     function (response) {
        //                         console.log(response);
        //                         Dom.createNotification(constantes.messages.ERROR_MESSAGE, constantes.ALERT_ERROR);
        //                     }
        //                 ).bind(this);
        //         },
        //         orderLink() {
        //             window.location = `/order/group/${this.group.id}`;
        //         },
        //     },
        //     created(){
        //         this.revertStateOnModalDismissal();
        //     }
        // });
    }
}