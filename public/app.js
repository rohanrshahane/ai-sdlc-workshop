/* Campus Events front end */
const list = document.getElementById('event-list');
const statusEl = document.getElementById('status');

function renderEvents(events) {
  list.innerHTML = '';
  for (const e of events) {
    const li = document.createElement('li');
    li.className = 'event';
    li.dataset.testid = 'event-card';
    const full = e.seatsRemaining === 0;
    li.innerHTML = `
      <h2></h2>
      <p class="meta"><span class="when"></span> · <span class="where"></span></p>
      <p class="description"></p>
      <span class="seats${full ? ' full' : ''}"></span>`;
    li.querySelector('h2').textContent = e.title;
    // BUG (work item 104): the raw date and time are shown instead of a friendly format.
    li.querySelector('.when').textContent = `${e.date} ${e.time}`;
    li.querySelector('.where').textContent = e.location;
    li.querySelector('.description').textContent = e.description;
    li.querySelector('.seats').textContent = full ? 'Full' : `${e.seatsRemaining} seats left`;
    list.appendChild(li);
  }
}

async function loadEvents() {
  statusEl.textContent = 'Loading events…';
  const res = await fetch('/api/events');
  const events = await res.json();
  statusEl.textContent = '';
  renderEvents(events);
}

loadEvents().catch(() => { statusEl.textContent = 'Could not load events.'; });
