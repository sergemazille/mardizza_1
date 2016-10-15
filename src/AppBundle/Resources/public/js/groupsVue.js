import {Dom} from './Dom';
import {Event} from './Event';
import * as constantes from './constantes';

export class groupsVue {

    static init() {

        Vue.component('group', {
            template: '#group-template',
            props: ['group'],
            data(){
                return {
                    tempName: this.group.name,
                    tempColor: this.group.color,
                    tempStamps: this.group.stamps,
                    tempImageUrl: this.group.imageUrl,
                    tempAdminIds: this.adminIds,
                    newImageFlag: "", // used to check if image input has been changed or not
                    adminIds: [],
                    csrf: '',
                    user: '',
                    invitationOn: false,
                    invitationEmail: '',
                }
            },
            methods: {
                revertChanges() {
                    this.group.name = this.tempName;
                    this.group.color = this.tempColor;
                    this.group.stamps = this.tempStamps;
                    this.group.imageUrl = this.tempImageUrl;
                    // this.adminIds = this.tempAdminIds;
                },
                saveState() {
                    this.tempName = this.group.name;
                    this.tempColor = this.group.color;
                    this.tempStamps = this.group.stamps;
                    this.tempImageUrl = this.group.imageUrl;
                    this.tempAdminIds = this.adminIds;
                },
                getImageFromImageUrl(imageUrl){
                    let tmp = imageUrl.split('/');
                    return tmp.slice(-1).pop();
                },
                stateHasChanged(){
                    return (this.group.name != this.tempName ||
                    this.group.color != this.tempColor ||
                    this.group.stamps != this.tempStamps ||
                    this.group.imageUrl != this.tempImageUrl ||
                    this.adminIds != this.tempAdminIds ||
                    this.newImageFlag != '');
                },
                updateGroup() {
                    // if nothing has changed the form isn't submitted
                    if (this.stateHasChanged() && this.formDataIsValid()) {
                        this.submitForm();
                    } else if (this.formDataIsValid()) {
                        Dom.hideModal();
                    }
                },
                quitGroup(){
                    let formData = new FormData();
                    formData.append('csrf', this.csrf);

                    this.$http.post(`/group/quit/${this.group.id}`, formData)
                        .then(
                            // success
                            function (response) {
                                if (response.body == "ok") {
                                    this.group.userIsAdmin = false;
                                    Dom.hideModal();
                                    Dom.createNotification(constantes.messages.GROUP_QUITTED, constantes.ALERT_SUCCESS);
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
                confirmDeleteGroup(){
                    // hide displayed modal
                    Dom.hideModal();

                    // show confirmation modal
                    this.showConfirmation();
                },
                deleteGroup(){
                    let formData = new FormData();
                    formData.append('csrf', this.csrf);

                    this.$http.post(`/group/delete/${this.group.id}`, formData)
                        .then(
                            // success
                            function (response) {
                                if (response.body == "ok") {
                                    Dom.hideModal();
                                    Dom.createNotification(constantes.messages.GROUP_DELETED, constantes.ALERT_SUCCESS);
                                    vm.groups.$remove(this.group);
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
                showConfirmation(){
                    // show confirmation modal
                    $("#confirmation_modal_"+this.group.id).modal("show");
                },
                submitForm(){
                    // form submission
                    let formData = new FormData();

                    formData.append('csrf', this.csrf);
                    formData.append('image', this.$els.fileinput.files[0]);
                    formData.append('name', this.group.name);
                    formData.append('color', this.group.color);
                    formData.append('stamps', this.group.stamps);
                    formData.append('adminIds', this.adminIds);

                    this.$http.post(`/group/update/${this.group.id}`, formData)
                        .then(
                            // success
                            function (response) {
                                if (response.body == "ok") {
                                    // update image if it has been changed
                                    if (this.$els.fileinput.files[0]) {
                                        this.group.imageUrl = 'assets/images/group/' + this.$els.fileinput.files[0].name;
                                    }
                                    this.newImageFlag = ""; // set variable back to empty for next changes
                                    Dom.hideModal();
                                    Dom.createNotification(constantes.messages.GROUP_UPDATED, constantes.ALERT_SUCCESS);
                                } else {
                                    Dom.createNotification(constantes.messages.ERROR_MESSAGE, constantes.ALERT_ERROR);
                                }
                            },
                            // error
                            function (response) {
                                console.log(response.body);
                                Dom.createNotification(constantes.messages.ERROR_MESSAGE, constantes.ALERT_ERROR);
                            }
                        ).bind(this);
                },
                createGroup() {
                    $.post("/group/create")
                        .done(function () {
                            Dom.createNotification('Le groupe a bien été créé', constantes.ALERT_SUCCESS);
                        })
                        .error(function (data) {
                            console.log(data);
                            Dom.createNotification(data, constantes.ALERT_ERROR);
                        });
                },
                formDataIsValid(){

                    // test image size isn't greater than 1Mo and is an actual image
                    if (this.$els.fileinput.files[0]) {

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
                    }

                    // test there's at least one admin
                    if (this.adminIds.length <= 0) {
                        Dom.createNotification(constantes.messages.ONE_ADMIN, constantes.ALERT_ERROR);
                        return false;
                    }

                    // if every test is valid then send ok to keep going on with form submission
                    return true;
                },
                // revert changes on modal dismissal if nothing has been saved
                revertStateOnModalDismissal(){
                    let self = this;
                    vm.$nextTick(function () {

                        // revert when click outside modal content
                        $(".modal.fade").on('click', function (e) {
                            if (e.target == this) {
                                self.revertChanges();
                            }
                        });

                        // revert when ESC key pressed
                        $(document).keyup(function (e) {
                            if (e.keyCode == 27) { // escape key maps to keycode `27`
                                self.revertChanges();
                            }
                        });
                    });
                },
                userIsLastMember(){
                    return this.group.members.length <= 1;
                },
                userIsLastAdmin(){
                    return this.adminIds.length <= 1;
                },
                openInvitation(){
                    this.invitationOn = true;
                },
                sendInvitation(){
                    // todo
                    console.log(this.invitationEmail);
                },
            },
            created(){
                this.revertStateOnModalDismissal();
            }
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