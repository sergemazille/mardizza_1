import {Dom} from './Dom';
import * as mime from 'mime-types';

export class groupsVue {

    static init() {

        Vue.component('group', {
            template: '#group-template',
            props: ['group'],
            data(){
                return {
                    tempName: '',
                    tempColor: '',
                    tempImageUrl: '',
                    newImageFlag: "", // used to check if image input has been changed or not
                    adminIds: [],
                    csrf: '',
                }
            },
            methods: {
                revertChanges() {
                    this.group.name = this.tempName;
                    this.group.color = this.tempColor;
                    this.group.imageUrl = this.tempImageUrl;
                    this.adminIds = this.tempAdminIds;
                },
                saveState() {
                    this.tempName = this.group.name;
                    this.tempColor = this.group.color;
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
                submitForm(){
                    // form submission
                    let formData = new FormData();

                    formData.append('csrf', this.csrf);
                    formData.append('image', this.$els.fileinput.files[0]);
                    formData.append('name', this.group.name);
                    formData.append('color', this.group.color);
                    formData.append('adminIds', this.adminIds);

                    this.$http.post(`/group/update/${this.group.id}`, formData)
                        .then(
                            // success
                            function () {
                                // update image if it has been changed
                                if (this.$els.fileinput.files[0]) {
                                    this.group.imageUrl = 'assets/images/group/' + this.$els.fileinput.files[0].name;
                                }
                                this.newImageFlag = ""; // set variable back to empty for next changes
                                Dom.hideModal();
                                Dom.createNotification('Le groupe a bien été mis à jour', 'alert-success');
                            },
                            // error
                            function (data) {
                                console.log(data);
                                Dom.createNotification('Une erreur est survenue', 'alert-danger');
                            }
                        ).bind(this);
                },
                createGroup() {
                    $.post("/group/create")
                        .done(function () {
                            Dom.createNotification('Le groupe a bien été créé', 'alert-success');
                        })
                        .error(function () {
                            Dom.createNotification('Une erreur est survenue', 'alert-danger');
                        });
                },
                formDataIsValid(){
                    // test image size isn't greater than 1Mo
                    if (this.$els.fileinput.files[0]) {
                        let imageSize = this.$els.fileinput.files[0].size;
                        if (imageSize > 100000) {
                            Dom.createNotification("L'image ne doit pas faire plus de 1 Mo", 'alert-danger');
                            return false;
                        }
                    }

                    // test there's at least one admin
                    if (this.adminIds.length <= 0) {
                        Dom.createNotification('Il doit rester au moins un administrateur', 'alert-danger');
                        return false;
                    }

                    // if every test is valid then send ok to keep going on with form submission
                    return true;
                },
                //revert changes on modal dismissal if nothing has been saved
                revertStateOnModalDismissal(){
                    let self = this;
                    vm.$nextTick(function () {

                        // revert when click outside modal content
                        $(".modal.fade").on('click', function(e){
                            if(e.target == this){
                                self.revertChanges();
                            }
                        });

                        // revert when ESC key pressed
                        $(document).keyup(function(e) {
                            if (e.keyCode == 27) { // escape key maps to keycode `27`
                                self.revertChanges();
                            }
                        });
                    });
                }
            },
            created(){
                this.revertStateOnModalDismissal();
            }
        });

        let vm = new Vue({
            el: '#groups',
            data: {
                groups: [],
            },
            methods: {
                getGroups(){
                    $.get('/get/groups', function (groups) {
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