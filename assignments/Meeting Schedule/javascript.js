document.addEventListener('DOMContentLoaded', () => {
    const meetingForm = document.getElementById('meeting-form');
    const meetingInput = document.getElementById('meeting-input');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    const meetingList = document.getElementById('meeting-list');
    let meetings = JSON.parse(localStorage.getItem('meetings')) || [];

    meetingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addMeeting();
    });

    function addMeeting() {
        const subject = meetingInput.value.trim();
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        if (subject && startTime && endTime) {
            const meeting = {
                id: Date.now(),
                subject,
                startTime,
                endTime,
                completed: false,
                overdue: false
            };
            meetings.push(meeting);
            saveToLocalStorage();
            renderMeetings();
            meetingInput.value = '';
            startTimeInput.value = '';
            endTimeInput.value = '';
        }
    }

    function renderMeetings(filter = 'all') {
        meetingList.innerHTML = '';
        let filteredMeetings = [];
        let message = '';
        const currentTime = new Date().toISOString();

        switch (filter) {
            case 'completed':
                filteredMeetings = meetings.filter(meeting => meeting.completed);
                message = filteredMeetings.length === 0 ? 'No meetings are completed.' : '';
                break;
            case 'pending':
                filteredMeetings = meetings.filter(meeting => !meeting.completed && !meeting.overdue);
                message = filteredMeetings.length === 0 ? 'No meetings are pending.' : '';
                break;
            case 'overdue':
                filteredMeetings = meetings.filter(meeting => meeting.overdue && !meeting.completed);
                message = filteredMeetings.length === 0 ? 'No meetings are overdue.' : '';
                break;
            default:
                filteredMeetings = meetings;
                break;
        }

        if (filteredMeetings.length === 0 && message) {
            meetingList.innerHTML = `<li class="message">${message}</li>`;
        }

        filteredMeetings.forEach(meeting => {
            if (currentTime > meeting.endTime && !meeting.completed) {
                meeting.overdue = true;
            }
            const li = document.createElement('li');
            li.classList.add('meeting-item');
            if (meeting.completed) {
                li.classList.add('completed');
            }
            if (meeting.overdue && !meeting.completed) {
                li.classList.add('overdue');
            }
            li.innerHTML = `
                <span>${meeting.subject} (Start: ${new Date(meeting.startTime).toLocaleString()}, End: ${new Date(meeting.endTime).toLocaleString()})</span>
                <div>
                    <button class="edit" onclick="editMeeting(${meeting.id})">Edit</button>
                    <button class="delete" onclick="deleteMeeting(${meeting.id})">Delete</button>
                    <button class="complete" onclick="toggleComplete(${meeting.id})">${meeting.completed ? 'Undo' : 'Complete'}</button>
                </div>
            `;
            meetingList.appendChild(li);
        });
    }

    function saveToLocalStorage() {
        localStorage.setItem('meetings', JSON.stringify(meetings));
    }

    window.deleteMeeting = function(id) {
        meetings = meetings.filter(meeting => meeting.id !== id);
        saveToLocalStorage();
        renderMeetings();
    }

    window.editMeeting = function(id) {
        const meeting = meetings.find(meeting => meeting.id === id);
        meetingInput.value = meeting.subject;
        startTimeInput.value = meeting.startTime;
        endTimeInput.value = meeting.endTime;
        meetings = meetings.filter(meeting => meeting.id !== id);
        saveToLocalStorage();
        renderMeetings();
    }

    window.toggleComplete = function(id) {
        const meeting = meetings.find(meeting => meeting.id === id);
        meeting.completed = !meeting.completed;
        meeting.overdue = false;
        saveToLocalStorage();
        renderMeetings();
    }

    window.filterMeetings = function(filter) {
        renderMeetings(filter);
    }

    renderMeetings();
});
