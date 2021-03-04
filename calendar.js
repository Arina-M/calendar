const dataGreenRoom = {
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
};

const dataRedRoom = {
    wednesday:
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
    thursday: {
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
};

const days = ['monday','tuesday','wednesday','thursday','friday'];
const mettingHours = {
    start: 10,
    end: 18
}


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

    renderEvent(event){
        console.log(event);

        let eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.style.backgroundColor = this.eventColor;

        let cancelBtn = document.createElement('button');
        cancelBtn.classList.add('event__cancel');
        cancelBtn.innerHTML = `x`;
        //cancelBtn.addEventListener('click',this.cancelEvent);

        let name = document.createElement('p');
        name.classList.add('event__name');
        name.innerHTML = `<b>${event.name}</b>`;

        let users = document.createElement('p');
        users.classList.add('event__users');
        users.innerHTML = event.users.join(', ');

        eventDiv.append(name, users, cancelBtn);

        return eventDiv;
    }

    static cancelEvent(cancelBtn){
        // let currentTD = cancelBtn.parentElement.parentElement;
        let currentTD = cancelBtn.closest('td'),
            currentTDid = currentTD.dataset.id,
            table = currentTD.closest('table'),
            tableId = table.id;
        console.log(tableId);
        //console.dir(currentTDid);

        let data = currentTDid.split('-');
        //console.log(data);

        let day = data[0],
            hour = data[1];

        let calendar = JSON.parse(localStorage[tableId]);
        delete calendar[day][hour];
        localStorage[tableId] = JSON.stringify(calendar);

        currentTD.innerHTML = ``;
    }
}

let roomGreen = new Calendar('roomGreen',['monday','tuesday','friday'],{start: 10,end: 18},'green');
roomGreen.data = dataGreenRoom;
// console.log(roomGreen);
roomGreen.renderCalender();
roomGreen.infoCalendar();


let roomRed = new Calendar('roomRed',['wednesday','thursday',],{start: 9,end: 20},'red');
roomRed.data = dataRedRoom;
// console.log(roomRed);
roomRed.renderCalender();
roomRed.infoCalendar();

let cancelBTNs = document.querySelectorAll('.event__cancel');

cancelBTNs.forEach(function(btn){
    btn.addEventListener('click',function(){
        Calendar.cancelEvent(btn);
    })
})


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


