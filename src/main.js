//var loginModule = require('js/login');

$(document).ready(function () {

    var _profile = {}, _autoCompleteList = {};

    onLaunchInfo();

    function onLaunchInfo() {
        loader('on');
        //TODO: get the db connected first and then load the settings buddy
        var profile = JSON.parse(sessionStorage.getItem('asgardian'));

        if (profile) {
            fetchUserInfo(profile, function (response) {
                if (response && response !== null) {
                    setProfile(response);
                    fetchMetaInfo(profile);
                }

            });
        }
        else {

            doesThisExist($('#modalLogin'), function () {
                openLoginModal();
            });
        }
    }

    function fetchMetaInfo(user) {
        console.log("fetch meta information ", user);
        if (user) {
            console.log(" working here ------ >:", user.role);
            switch (user.role) {
                case 'admin':
                    fetchAll();
                    break;
                case 'scrummaster':
                    fetchForMaster(_profile.team);
                    break;

            }
        }

    }

    function fetchAll() {
        console.log("fetch All called");
        //TODO: Get only relevant All members and fill below
        _autoCompleteList = [];
        //getallassociates
        $.ajax({
            url: "/getallassociates",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data) {
                    _autoCompleteList = data;
                    updateAutoCompleteList(_autoCompleteList);

                }
            },
            error: function (msg, xhr) {
                if (msg && msg.responseJSON !== "") {
                    errorPill(msg.responseJSON);
                }
            }
        });
    }

    function updateAutoCompleteList(data) {
        if (data && !isEmpty(data))
            $('input.autocomplete').autocomplete('updateData', data);
    }

    function fetchForMaster(team) {
        console.log("Team name:", team);
        //TODO: Get only relevant team list and fill below

    }


    M.AutoInit();

    $('.carousel.carousel-slider').carousel({
        fullWidth: false,
        duration: 1000,
        dist: 150
    });

    carouselInterval();

    function carouselInterval() {
        setInterval(function () {
            var $carousel = M.Carousel.getInstance($('.carousel.carousel-slider'));
            $carousel.next();
        }, 5000);
    }

    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy',
        top: '25%',
        multidate: true,
        disableWeekends: true,
        container: $('.datePickerContainer'),
        onSelect: function (selectedDate) {
            console.log();
            var $selDate = $(document).find('#dpForLeaves .datepicker-row td.is-selected');
            $selDate.addClass('multiSelectDates');
            var epoch = new Date(selectedDate).getTime();
            $('.chips-autocomplete').chips('addChip', {tag: new Date(epoch).toLocaleDateString()});
        },
        onOpen: function () {
            console.log("date picker opened:");
        },
        onClose: function (status) {

            $('.leavesPlaceholder').css({'margin-top': '0'});
        },
        onDraw: function () {
            console.log("date picker on draw");
        }
    });

    function clearSelOfDates() {
        //$(document).find('.multiSelectDates').removeClass('multiSelectDates');
    }


    $(document).on('click', '.modal-overlay', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        $('.leavesPlaceholder').css({'margin-top': '0'});
    });

    $('.fixed-action-btn').floatingActionButton({
        direction: 'bottom',
        hoverEnabled: false,
    });

    function instantiateChips(data) {
        $('.chips-autocomplete').chips({
            autocompleteOptions: {
                data: data,
                limit: 3
            },
            placeholder: 'DD/MMM/YYYY',
            secondaryPlaceholder: '+ DD/MMM/YYYY',
            onChipAdd: function (a, b, c) {
                console.log("chip got added");
            },
            onChipSelect: function (a, b, c) {
                console.log("chip got selected");
            },
            onChipDelete: function (a, b, c) {
                console.log("chip got deleted ");
            }
        });
    }

    function getDaysInMonth(month, year) {
        var date = new Date(year, month, 1);
        var days = {};
        while (date.getMonth() === month) {
            days[new Date(date).toLocaleDateString()] = null;
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    function loader(status) {
        switch (status) {
            case "on": {
                $('.loader').css({
                    "display": "block"
                });
            }
                break;
            case "off": {
                $('.loader').css({
                    "display": "none"
                });
            }
                break;

        }
    }

    $('#login').on('click', function (e) {
        e.stopImmediatePropagation();
        openLoginModal();
    });

    function openLoginModal() {

        loader('off');
        $('#modalLogin').modal('open').css("width", "40%");
        clearLoginModal();
    }

    $('#addAssociates').on('click', function (e) {
        e.stopImmediatePropagation();
        $('#addMembersModal').modal('open');
        clearAddEmpModal();
    });

    function validateEmpInfo() {
        var parent = $('#addMembersModal');
        var pid = parent.find('#p_empId').val().trim();
        var pfirst = parent.find('#p_firstName').val().trim();
        var plast = parent.find('#p_lastName').val().trim();
        var pemail = parent.find('#p_email').val().trim();
        var pmobile = parent.find('#p_phone').val().trim();
        var pteam = parent.find('select').formSelect('getSelectedValues')[0];

        console.log(pid, pfirst, plast, pemail, pmobile, pteam);
        var fullName = pfirst + " " + plast;
        var data = {
            name: fullName,
            empId: pid,
            email: pemail,
            role: 'designer',
            team: pteam,
            ra: 'A&O',
            permissions: null,
            mobile: pmobile
        };


        return data;
    }

    function clearAddEmpModal() {
        showAdd('off');
        var parent = $('#addMembersModal');
        parent.find('#p_empId').val("");
        pfirst = parent.find('#p_firstName').val("");
        parent.find('#p_lastName').val("");
        parent.find('#p_email').val("");
        parent.find('#p_phone').val("");
        parent.find('select').formSelect();
    }

    function showAdd(status) {
        switch (status) {
            case 'on': {
                $('#addMember').css({"display": 'block'});
                $('#validateMember').css({"display": 'none'});
            }
                break;
            case 'off': {
                $('#addMember').css({"display": 'none'});
                $('#validateMember').css({"display": 'block'});
            }
                break;
        }

    }

    $('#validateMember').on('click', function (e) {
        e.stopImmediatePropagation();
        var parent = $('#addMembersModal');
        var pid = parent.find('#p_empId').val().trim();
        var pfirst = parent.find('#p_firstName').val().trim();
        var plast = parent.find('#p_lastName').val().trim();
        var pemail = parent.find('#p_email').val().trim();
        var pmobile = parent.find('#p_phone').val().trim();
        var pteam = parent.find('select').formSelect('getSelectedValues')[0];

        if (pid !== "" && pfirst !== "" && plast !== "" && pemail !== "" && pmobile !== "" && pteam !== "") {
            showAdd('on');
        }

    });

    $('#addMember').on('click', function (e) {
        e.stopImmediatePropagation();
        var empInfo = validateEmpInfo();
        addMember(empInfo);
        clearAddEmpModal();
    });


    function clearLoginModal() {
        $('#username').val("");
        $('#password').val("");
    }

    $('#loginOk').on('click', function (e) {
        e.stopImmediatePropagation();
        var usrName = $('#username').val().trim();
        var pwd = $('#password').val().trim();
        $('#modalLogin').modal('close');

        loader('on');
        onAuth(usrName, pwd, function (result) {
            if (result !== null && result.access !== 'invalid') {
                loader('off');
                successfulLogin(result);
            }
            else {
                invalidUser();
            }

        });
    });


    function successfulLogin(usr) {
        sessionStorage.setItem('asgardian', JSON.stringify(usr));
        fetchUserInfo(usr, function (response) {
            if (response && response !== null) {
                setProfile(response);
            }

        });

    }

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    function setProfile(userProfile) {

        if (isEmpty(userProfile)) {
            _profile = {};
            $('#profile_name').find('span.name').text("");
            $('#profile_role').find('span.role').text("");
            $('#profile_email').find('span.email').text("");
        } else {
            _profile = userProfile;
            $('#profile_name').find('span.name').text(userProfile.name + ' (' + userProfile.empId + ')');
            $('#profile_role').find('span.role').text(toTitleCase(userProfile.role));
            $('#profile_email').find('span.email').text(userProfile.email);

        }

        loader('off');

    }


    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    function fetchUserInfo(usr, cb) {
        if (usr && usr !== '') {

            $.ajax({
                url: "/getuser",
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(usr),
                success: function (data) {
                    if (cb) {
                        cb(data);
                    }
                },
                error: function (msg, xhr) {
                    if (msg && msg.responseJSON !== "") {
                        errorPill(msg.responseJSON);
                    }
                }
            });

        }
    }

    function fetchUser(usr, cb) {
        if (usr && usr !== '' && !isEmpty(usr)) {

            $.ajax({
                url: "/getemployee",
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(usr),
                success: function (data) {
                    if (cb) {
                        cb(data);
                    }
                },
                error: function (msg, xhr) {
                    if (msg && msg.responseJSON !== "") {
                        errorPill(msg.responseJSON);
                    }

                }
            });

        }
    }


    function invalidUser() {

    }

    function onAuth(name, pwd, cb) {

        $.ajax({
            url: "/authenticate",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({cred: {username: name, password: pwd}}),
            success: function (data) {
                if (cb) {
                    cb(data);
                }
            },
            error: function (msg, xhr) {
                if (msg && msg.responseJSON !== "") {
                    errorPill(msg.responseJSON);
                }
            }
        });

    }


    function successChip(msg) {

        if (msg.indexOf('error') !== -1) {
            M.toast({html: msg, classes: 'rounded red white-text'});
        } else {
            M.toast({html: msg, classes: 'rounded themeColor'});
        }


    }

    function errorPill(msg) {
        console.log("error oill called", msg);

        M.toast({html: msg, classes: 'rounded red white-text'});
    }

    function addMember(data) {
        if (!isEmpty(data) && Object.keys(data).length > 4) {
            $.ajax({
                url: '/addemployee',
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(data),
                success: function (response) {
                    successChip(response);
                    $('#addMembersModal').modal('close');

                },
                error: function (msg, xhr) {
                    if (msg && msg.responseJSON !== "") {
                        console.log("error from addMember()");
                        errorPill(msg.responseJSON);
                    }
                }
            });
        }

    }


    $('#autocomplete-input').click(function (e) {
        var emp = $(this).val();
        if (emp !== "") {
            onSearch(emp);
        }

    });

    $('.clearSearch').on('click', function (e) {
        e.stopImmediatePropagation();
        $(this).parent().find('#autocomplete-input').val("");
    });

    $('#searchEmp').click(function (e) {
        var emp = $(this).parent().find('#autocomplete-input').val();
        if (emp !== "") {
            onSearch(emp);
        }
    });

    var emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    function is_numeric(str) {
        return /^\d+$/.test(str);
    }

    function onSearch(employee) {

        if (employee !== "") {
            var query = {};
            var queryType = 'string';

            if (emailRegex.test(employee)) {
                queryType = 'email';
            }
            if (is_numeric(employee)) {
                queryType = 'number';
            }

            switch (queryType) {
                case 'number': {
                    query['empId'] = Number(employee);
                }
                    break;
                case 'email': {
                    query['email'] = employee;

                }
                    break;
                case 'string': {
                    query['name'] = employee;
                }
                    break;


            }
            fetchUser(query, function (response) {

                if (!isEmpty(response)) {
                    setSearchProfile(response);
                }
            });
        }


    }

    function setSearchProfile(profile) {
        var male = 'images/man_profile_icon.png';
        var female = 'images/woman_profile_icon.png';
        var imageSrc = profile.gender === 'male' ? male : female;


        var q_name = '<img src=' + imageSrc + ' alt="Team Member">' + profile.name;
        var q_team = '<img src="images/team_icon.jpg" alt="Team Name">' + profile.team;
        $('.pv_name').find('.chip').html(q_name);
        $('.pv_teamName').find('.chip').html(q_team);

    }

    $('input.autocomplete').autocomplete({
        data: {
            "Aditya Vikram Damerla Veoma": null,
            "adityavikram.dv@tcs.com": null,
            "882970": null
        },
        limit: 3,
        onAutocomplete: function (selected) {
            if (selected !== "") {
                onSearch(selected);
            }
        }

    });

    $('.search-container #autocomplete-input').on('keyup', function (e) {
        e.stopImmediatePropagation();
        if ($(this).val() !== "") {
            $('.search-container .clearSearch').css({'display': 'block'});

        } else {
            $('.search-container .clearSearch').css({'display': 'none'});
        }
    })


    // Team mate logic

    $('#calendar').on('click', function (e) {
        e.stopImmediatePropagation();
        var date = new Date();
        var chipSuggestions = getDaysInMonth(date.getMonth(), date.getFullYear());
        instantiateChips(chipSuggestions);
        $('.datepicker').datepicker('open');
        $('.leavesPlaceholder').css({'margin-top': '350px', 'display': 'block'});
    });

    $('.save_dates').on('click', function (e) {
        e.stopImmediatePropagation();

        var datesToSave = M.Chips.getInstance($('.chips-autocomplete')).chipsData;
        if (datesToSave.length > 0) {
            var profileOf = 882970;
            var query = {empId: profileOf};
            var dataToSend = {leavesTaken: datesToSave};

            console.log(query, dataToSend);
            $.ajax({
                url: "/updateemployee",
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({query: query, update: dataToSend}),
                success: function (data) {
                    console.log("success response :", data);
                },
                error: function (msg, xhr) {
                    if (msg && msg.responseText !== "" && msg.responseText !== undefined) {
                        console.log("error from updateemployee()", msg);
                        errorPill(msg.responseText);
                    }
                }
            })
            ;
        }

    });


    //dr banner logic
    $('.drb_add').on('click', function (e) {
        e.stopImmediatePropagation();
        $('#adminModal_Add').modal('open');
        clear_userAddModal();

    });

    function admin_add(data, cb) {
        $.ajax({
            url: "/admin_add",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: function (data) {
                if (cb) {
                    cb(data);
                }
            },
            error: function (msg, xhr) {
                if (msg && msg.responseJSON !== "") {
                    errorPill(msg.responseJSON);
                }
            }
        });
    }


    function clear_userAddModal() {
        $('#usrName').val("");
        $('#usrPwd').val('');
        $('#usrempid').val('');
        $('#adminModal_Add').find('select').formSelect();

    }

    function feedAssociate(user) {

    }

    $('#admin_add').on('click', function (e) {
        e.stopImmediatePropagation();
        var roleToAdd = {};
        roleToAdd.username = $('#usrName').val().trim();
        roleToAdd.password = $('#usrPwd').val().trim();
        roleToAdd.empId = $('#usrempid').val().trim();
        roleToAdd.team = $('#user_team').val().trim();
        roleToAdd.role = $('#adminModal_Add').find('select').formSelect('getSelectedValues')[0];
        if (roleToAdd.username !== "" && roleToAdd.password !== "" && roleToAdd.empId !== "" && roleToAdd.role !== "" && roleToAdd.team !== "") {
            clear_userAddModal();
            $('#adminModal_Add').modal('close');
            admin_add(roleToAdd, function (msg) {
                successChip(msg);
            });
        }


    });


    $('#drb_roles').on('mouseover', function (e) {
        e.stopImmediatePropagation();
        console.log("hovered on roles");

    })
    //LOG OUT MODULE :

    $('#logout').on("click", function (e) {
        e.stopImmediatePropagation();
        loader('on')
        console.log("LOG OUT CLICKED");
        sessionStorage.removeItem('asgardian');
        setProfile("");
    });


    // does element creaeted/exists yet
    function doesThisExist(element, cb) {
        var checkElemExistInterval = setInterval(function () {
            console.log("checking fro elemenst existence here ");
            if (element) {
                cb();
                clearInterval(checkElemExistInterval);
            }
        }, 100);
    }
});