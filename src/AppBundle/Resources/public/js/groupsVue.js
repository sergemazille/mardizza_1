import {Dom} from './Dom';

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
                    adminIds: [],
                    memberIds: [],
                }
            },
            methods: {
                revertChanges() {
                    this.group.name = this.tempName;
                    this.group.color = this.tempColor;
                    this.group.imageUrl = this.tempImageUrl;
                    this.adminIds = this.tempAdminIds;
                    this.memberIds = this.tempMemberIds;
                },
                saveState() {
                    this.tempName = this.group.name;
                    this.tempColor = this.group.color;
                    this.tempImageUrl = this.group.imageUrl;
                    this.tempAdminIds = this.adminIds;
                    this.tempMemberIds = this.memberIds;
                },
                getImageFromImageUrl(imageUrl){
                    let tmp = imageUrl.split('/');
                    return tmp.slice(-1).pop();
                },
                getIdsFromMembers(){
                    return $(this.group.members).map(function (index, member) {
                        return member.id;
                    }).toArray();
                },
                updateGroup() {

                    // check if nothing has changed
                    if (
                        this.group.name == this.tempName &&
                        this.group.color == this.tempColor &&
                        this.group.imageUrl == this.tempImageUrl &&
                        this.adminIds == this.tempAdminIds &&
                        this.memberIds == this.tempMemberIds
                    ) {
                        Dom.hideModal();
                        return;
                    }

                    // validation before ajax call
                    if (!this.formDataIsValid()) {
                        // TODO: create custom messages for other possible errors
                        Dom.createNotification('Il doit rester au moins un administrateur', 'alert-danger')
                        return;
                    }

                    $.post(`/group/update/${this.group.id}`,
                        {
                            csrf: vm.token,
                            name: this.group.name,
                            color: this.group.color,
                            image: this.getImageFromImageUrl(this.group.imageUrl),
                            adminIds: this.adminIds,
                            memberIds: this.memberIds,
                        }
                    )
                        .done(function () {
                            Dom.hideModal();
                            Dom.createNotification('Le groupe a bien été mis à jour', 'alert-success');
                        })
                        .fail(function () {
                            Dom.createNotification('Une erreur est survenue', 'alert-danger');
                        });
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
                    // TODO: sanitize data
                    return this.adminIds.length > 0;
                }
            },
            created(){
                this.memberIds = this.getIdsFromMembers();
            }
        });

        let vm = new Vue({
            el: '#groups',
            props: ['token'],
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