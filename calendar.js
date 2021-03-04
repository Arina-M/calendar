class Calendar{
    constructor(tableId,days=[],hours={},eventColor){
        this.tableId = tableId;
        this.days = days;
        this.hours = hours;
        this.eventColor = eventColor;
    }

    set data(data){
        if(!localStorage[this.tableId]){
            localStorage.setItem(this.tableId, JSON.stringify(data) );
        }
    }

    get data(){
        return JSON.parse(localStorage[this.tableId]);
    }

    renderCalender(){
        let thead = this.days.
        map(function(day){
            return `<th>${day}</th>`;
        });

        let tbody = [];

        for(let i=this.hours.start; i<=this.hours.end; i++){
            //console.log(i);
            let tds = this.days
                .map(function(day){
                    return `<td data-id=${day}-${i}></td>`;
                })
                .join('');

            let tr = `<tr><td>${i}:00</td>${tds}</tr>`;
            tbody.push(tr);
            //console.log(tr);
        }

        let table = `<table id='${this.tableId}'>
			<thead>
				<th>Name</th>
				${thead.join('')}
			</thead>
			<tbody>
				${tbody.join('')}
			</tbody>
		</table>`;

        let meeting_room = document.querySelector('#meeting_room');

        meetingRoom.innerHTML += table;
    }

    static infoCalendar(calendar,data){
        let calendarInfo = data ? data : calendar.data;
        //console.log(calendarInfo);

        let table = document.querySelector(`#${calendar.table_Id}`),
            tds = table.querySelectorAll('td:nth-child(n+2)');

        Calendar.emptyTDs(tds);

        for(let key in calendarInfo){
            let day = calendarInfo[key];
            //console.log(day);

            for(let hour in day){
                let event = day[hour],
                    current_TD = table.querySelector(`td[data-id=${key}-${hour}]`);

                if(event !== null){
                    current_TD.innerHTML = Calendar.renderEvent(event,calendar);
                }
            }
        }
    }

    static emptyTDs(tds){
        tds.forEach(function(td){
            td.innerHTML = '';
        })
    }

    render_Users(parentElement){

        let calendarInfo = this.data;
        //console.log(calendarInfo);

        let users = [];

        for(let key in calendarInfo){
            let day = calendarInfo[key];
            //console.log(day);

            for(let hour in day){
                users.push(day[hour].users);
            }
        }

        let all_users = users
            .flat()
            .filter(function(value, index, self) {
                return self.indexOf(value) === index;
            })
            .map(function(user){
                return `<option value="${user}">${user}</option>`;
            });

        all_users.unshift('<option value="all">All users</option>');
        //console.log(all_users);

        let select = document.createElement('select');
        select.dataset.name = "usersSelect";
        select.dataset.id = this.table_Id;
        select.innerHTML = all_users.join('');

        return select;
    }

    static userEvents(select){
        let userSelected = select.value,
            table_Id = select.dataset.id
        //console.log(userSelected,table_Id);

        let data = JSON.parse(localStorage[table_Id]);
        //console.log(data);

        if(userSelected !== 'all'){
            for(let key in data){
                let day = data[key];
                //console.log(day);
                for(let hour in day){
                    //console.log(day[hour]);
                    let hourEvent = day[hour];
                    if(!hourEvent.users.includes(userSelected)){
                        day[hour] = null
                    }
                }
            }
        }

        Calendar.infoCalendar(calendars[table_Id],data);
    }

    static renderEvent(event,calendar){
        let eventDiv = `<div class="event" style="background-color: ${calendar.eventColor}">
			<p class="event__name"><b>${event.name}</b></p>
		    <p class="event__users">${event.users.join(', ')}</p>
			<button id="${generate_ID()}" class="event__cancel">x</button>
		</div>`;
        return eventDiv;
    }

    static cancelEvent(cancel_Btn){
        let current_TD = cancel_Btn.closest('td'),
            current_TD_id = current_TD.dataset.id,
            table = current_TD.closest('table'),
            tableId = table.id;

        let data = current_TD_id.split('-');

        let day = data[0],
            hour = data[1];

        let calendar = JSON.parse(localStorage[tableId]);
        delete calendar[day][hour];
        localStorage[tableId] = JSON.stringify(calendar);

        current_TD.innerHTML = ``;
    }
}
let calendars = {
    roomGreen: new Calendar('roomGreen',['monday','tuesday','wednesday','thursday','friday'],{start: 10,end: 18},'#62d44d'),
    //roomRed: new Calendar('roomRed',['monday','tuesday','wednesday','thursday','friday'],{start: 10,end: 18},'#a41b28'),
    //roomPurple: new Calendar('roomPurple',['monday','tuesday','wednesday','thursday','friday'],{start: 10,end: 18},'#781e77')
}


let calendarsData = {
    roomGreen: {

        monday:
            {
                10: {
                    name: 'Daily Meeting',
                    users: ['Anna', 'Ivan']
                },
                18: {
                    name: 'Scrum Meeting',
                    users: ['Anna', 'Oleg']
                }
            }
        ,
        friday: {
            13: {
                name: 'Grooming',
                users: ['Irina', 'Ivan']
            },
            18:
                {
                    name: 'Scrum Meeting',
                    users: ['Anna', 'Irina']
                }
        }
    },
    // roomRed: {
    //     friday: {
    //         10: {
    //             name: 'Grooming',
    //             users: ['Irina', 'Ivan']
    //         },
    //         13:
    //             {
    //                 name: 'Scrum Meeting',
    //                 users: ['Anna', 'Irina']
    //             }
    //     }
    // },
    // roomPurple: {
    //     monday:
    //         {
    //             12: {
    //                 name: 'Daily Meeting',
    //                 users: ['Anna', 'Ivan']
    //             },
    //             13: {
    //                 name: 'Scrum Meeting',
    //                 users: ['Anna', 'Oleg']
    //             }
    //         }
    //     ,
    //     wednesday: {
    //         10: {
    //             name: 'Grooming',
    //             users: ['Irina', 'Ivan']
    //         },
    //         16:
    //             {
    //                 name: 'Scrum Meeting',
    //                 users: ['Anna', 'Irina']
    //             }
    //     }
    // }
}

for(let calendar in calendars){
    calendars[calendar].data = calendarsData[calendar];
    calendars[calendar].renderCalender();
    Calendar.infoCalendar(calendars[calendar]);
    //console.log(calendars[calendar]);
}

//console.log(calendars);

function generate_ID(length=10) {
    let result = '',
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        characters_length = characters.length;

    for (var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters_length));
    }
    return result;
}

let cancelBtns = document.querySelectorAll(`.event__cancel`);
cancelBtns
    .forEach(function(btn){
        btn.addEventListener('click',function(){
            Calendar.cancelEvent(btn);
        });
    });

let selectUsers = document.querySelectorAll(`select[data-name="usersSelect"]`);
selectUsers
    .forEach(function(select){
        select.addEventListener('change',function(){
            Calendar.userEvents(select);
        });
    });













// class myFunctions{
// 	static alert(){
// 		return `Hello`;
// 	}
// }
// console.log( myFunctions.alert() );

// localStorage.setItem('name','Ivan');
// localStorage.setItem('age',23);
// localStorage.setItem('children',['Anna, Olena','Ivan, Misha']);


// let user = {
// 	login: 'user',
// 	pass: 123
// };

// localStorage.setItem('calendar', JSON.stringify(user) );

// console.log(localStorage.name);
// console.log(localStorage.age);
// console.log(localStorage.children);
// console.log( JSON.parse(localStorage.calendar) );


