// Initialize variables
let nav = 0; // Navigation variable for switching months
let clicked = null; // Store the clicked date
let events = localStorage.getItem("events") // Load events from local storage if available
  ? JSON.parse(localStorage.getItem("events"))
  : []; // If not available, initialize as an empty array

// DOM element references
const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");

// Array of weekdays
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Function to open the modal for adding or deleting events
function openModal(date) {
  clicked = date;

  // Check if an event exists for the clicked date
  const eventForDay = events.find((e) => e.date === clicked);

  // Display appropriate modal based on event existence
  if (eventForDay) {
    document.getElementById("eventText").innerText = eventForDay.title;
    deleteEventModal.style.display = "block";
  } else {
    newEventModal.style.display = "block";
  }

  backDrop.style.display = "block"; // Display the modal backdrop
}

// Function to populate the calendar
function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Generate a string representing the first day of the month
  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

  // Update the displayed month and year
  document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
    "en-us",
    { month: "long" }
  )} ${year}`;

  calendar.innerHTML = ""; // Clear previous calendar content

  // Loop to create calendar day squares
  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;

      // Check if there's an event for the current day
      const eventForDay = events.find((e) => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = "currentDay"; // Highlight the current day
      }

      // If an event exists, display it
      if (eventForDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      // Add click event to open the modal
      daySquare.addEventListener("click", () => openModal(dayString));
    } else {
      daySquare.classList.add("padding"); // Add padding to days before the 1st of the month
    }

    calendar.appendChild(daySquare); // Add the day square to the calendar
  }
}

// Function to close the modal
function closeModal() {
  eventTitleInput.classList.remove("error"); // Remove error styling
  newEventModal.style.display = "none"; // Hide new event modal
  deleteEventModal.style.display = "none"; // Hide delete event modal
  backDrop.style.display = "none"; // Hide modal backdrop
  eventTitleInput.value = ""; // Clear the event title input
  clicked = null; // Clear the clicked date
  load(); // Reload the calendar
}

// Function to save an event
function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove("error"); // Remove error styling

    // Add the event to the events array
    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    // Update events in local storage
    localStorage.setItem("events", JSON.stringify(events));
    closeModal(); // Close the modal
  } else {
    eventTitleInput.classList.add("error"); // Add error styling to the input
  }
}

// Function to delete an event
function deleteEvent() {
  events = events.filter((e) => e.date !== clicked); // Remove the event from the events array
  localStorage.setItem("events", JSON.stringify(events)); // Update events in local storage
  closeModal(); // Close the modal
}

// Function to initialize button event listeners
function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;
    load(); // Load the calendar for the next month
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load(); // Load the calendar for the previous month
  });

  document.getElementById("saveButton").addEventListener("click", saveEvent);
  document.getElementById("cancelButton").addEventListener("click", closeModal);
  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEvent);
  document.getElementById("closeButton").addEventListener("click", closeModal);
}

// Initialize button event listeners and load the initial calendar
initButtons();
load();
