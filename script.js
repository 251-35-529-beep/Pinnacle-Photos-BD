// Password Configuration
const MASTER_PASSWORD = "admin123";
const SEGMENT_PASSWORDS = {
    1: "photo123",      // Photo of the Month
    2: "signature123",  // Signature Moment
    3: "weekly123",     // Weekly Best
    4: "theme123"       // Theme Best
};

const SEGMENT_NAMES = {
    1: "Photo of the Month",
    2: "Signature Moment of the Day",
    3: "Weekly Best Photo",
    4: "Theme Best Photo"
};

// Sub-segment data for Signature Moment
const SUB_SEGMENTS = {
    2: {
        landscape: "🏞️ Landscape",
        portrait: "👤 Portrait"
    }
};

// Data Storage
let segmentData = {
    1: { photographer: "", date: "", photo: "", description: "" },
    2: { 
        landscape: { photographer: "", date: "", photo: "", description: "" },
        portrait: { photographer: "", date: "", photo: "", description: "" }
    },
    3: { photographer: "", date: "", photo: "", description: "" },
    4: { photographer: "", date: "", photo: "", description: "" }
};

let currentSegment = null;
let currentSubSegment = null;

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem("pinnaclePhotosData");
    if (saved) {
        try {
            segmentData = JSON.parse(saved);
        } catch (e) {
            console.error("Error loading data:", e);
        }
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem("pinnaclePhotosData", JSON.stringify(segmentData));
}

// Login Handler
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const password = document.getElementById("masterPassword").value;
    const errorDiv = document.getElementById("loginError");

    if (password === MASTER_PASSWORD) {
        errorDiv.classList.remove("show");
        switchScreen("loginScreen", "mainPanel");
        document.getElementById("masterPassword").value = "";
    } else {
        errorDiv.textContent = "❌ Wrong password! Try again.";
        errorDiv.classList.add("show");
    }
});

// Screen Navigation
function switchScreen(fromScreen, toScreen) {
    document.getElementById(fromScreen).classList.remove("active");
    document.getElementById(toScreen).classList.add("active");
}

// Open Segment
function openSegment(segmentNumber) {
    currentSegment = segmentNumber;
    currentSubSegment = null;
    
    // Check if segment has sub-segments
    if (SUB_SEGMENTS[segmentNumber]) {
        document.getElementById("segmentTitle").textContent = SEGMENT_NAMES[segmentNumber];
        document.getElementById("passwordPrompt").style.display = "block";
        document.getElementById("segmentContent").style.display = "none";
        document.getElementById("subSegmentSelector").style.display = "block";
        document.getElementById("segmentPassword").value = "";
        document.getElementById("passwordError").classList.remove("show");
        
        // Show sub-segment buttons
        const subSegmentDiv = document.getElementById("subSegmentButtons");
        subSegmentDiv.innerHTML = "";
        for (const [key, label] of Object.entries(SUB_SEGMENTS[segmentNumber])) {
            const btn = document.createElement("button");
            btn.className = "btn btn-primary";
            btn.textContent = label;
            btn.onclick = () => selectSubSegment(key);
            subSegmentDiv.appendChild(btn);
        }
    } else {
        document.getElementById("segmentTitle").textContent = SEGMENT_NAMES[segmentNumber];
        document.getElementById("passwordPrompt").style.display = "block";
        document.getElementById("segmentContent").style.display = "none";
        document.getElementById("subSegmentSelector").style.display = "none";
        document.getElementById("segmentPassword").value = "";
        document.getElementById("passwordError").classList.remove("show");
    }
    
    switchScreen("mainPanel", "segmentEditor");
}

// Select Sub-Segment
function selectSubSegment(subSegment) {
    currentSubSegment = subSegment;
    document.getElementById("passwordPrompt").style.display = "block";
    document.getElementById("segmentPassword").value = "";
    document.getElementById("passwordError").classList.remove("show");
}

// Verify Segment Password
function verifySegmentPassword() {
    const password = document.getElementById("segmentPassword").value;
    const errorDiv = document.getElementById("passwordError");

    if (password === SEGMENT_PASSWORDS[currentSegment]) {
        errorDiv.classList.remove("show");
        document.getElementById("passwordPrompt").style.display = "none";
        document.getElementById("subSegmentSelector").style.display = "none";
        document.getElementById("segmentContent").style.display = "block";
        loadSegmentData();
    } else {
        errorDiv.textContent = "❌ Wrong segment password!";
        errorDiv.classList.add("show");
    }
}

// Load Segment Data
function loadSegmentData() {
    let data;
    
    if (currentSubSegment) {
        data = segmentData[currentSegment][currentSubSegment];
    } else {
        data = segmentData[currentSegment];
    }
    
    document.getElementById("photographerName").value = data.photographer || "";
    document.getElementById("photoDate").value = data.date || "";
    document.getElementById("photoDescription").value = data.description || "";

    // Display current photo if exists
    if (data.photo) {
        const preview = document.getElementById("photoPreview");
        preview.innerHTML = `<img src="${data.photo}" alt="Photo">`;
    } else {
        document.getElementById("photoPreview").innerHTML = "<p>Click to upload photo</p>";
    }

    displaySegmentContent();
}

// Photo Preview
function previewPhoto() {
    const file = document.getElementById("photoUpload").files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById("photoPreview");
            preview.innerHTML = `<img src="${e.target.result}" alt="Photo">`;
            // Store temporarily
            if (currentSubSegment) {
                segmentData[currentSegment][currentSubSegment].photo = e.target.result;
            } else {
                segmentData[currentSegment].photo = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
}

// Save Segment Photo
function saveSegmentPhoto() {
    const photographer = document.getElementById("photographerName").value;
    const date = document.getElementById("photoDate").value;
    const description = document.getElementById("photoDescription").value;

    if (!photographer || !date) {
        alert("⚠️ Please fill in photographer name and date!");
        return;
    }

    if (currentSubSegment) {
        segmentData[currentSegment][currentSubSegment] = {
            photographer: photographer,
            date: date,
            photo: segmentData[currentSegment][currentSubSegment].photo || "",
            description: description
        };
    } else {
        segmentData[currentSegment] = {
            photographer: photographer,
            date: date,
            photo: segmentData[currentSegment].photo || "",
            description: description
        };
    }

    saveData();
    displaySegmentContent();
    alert("✅ Photo saved successfully!");
}

// Display Segment Content
function displaySegmentContent() {
    let data;
    
    if (currentSubSegment) {
        data = segmentData[currentSegment][currentSubSegment];
    } else {
        data = segmentData[currentSegment];
    }
    
    const displayArea = document.getElementById("currentDisplay");

    if (data.photo) {
        displayArea.innerHTML = `
            <div class="display-content">
                <div class="info">
                    <strong>📷 Photographer:</strong> ${data.photographer}
                </div>
                <div class="info">
                    <strong>📅 Date:</strong> ${new Date(data.date).toLocaleDateString()}
                </div>
                <img src="${data.photo}" alt="Photo">
                <div class="info">
                    <strong>📝 Description:</strong> ${data.description || "N/A"}
                </div>
            </div>
        `;
    } else {
        displayArea.innerHTML = "<p>No photo uploaded yet</p>";
    }
}

// Clear Segment
function clearSegment() {
    if (confirm("Are you sure? This will clear all data for this segment.")) {
        if (currentSubSegment) {
            segmentData[currentSegment][currentSubSegment] = {
                photographer: "",
                date: "",
                photo: "",
                description: ""
            };
        } else {
            segmentData[currentSegment] = {
                photographer: "",
                date: "",
                photo: "",
                description: ""
            };
        }
        
        saveData();
        document.getElementById("photographerName").value = "";
        document.getElementById("photoDate").value = "";
        document.getElementById("photoDescription").value = "";
        document.getElementById("photoPreview").innerHTML = "<p>Click to upload photo</p>";
        displaySegmentContent();
    }
}

// Back to Main
function backToMain() {
    currentSegment = null;
    currentSubSegment = null;
    switchScreen("segmentEditor", "mainPanel");
}

// Logout
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        switchScreen("mainPanel", "loginScreen");
    }
}

// Make photo preview clickable
document.addEventListener("DOMContentLoaded", function () {
    loadData();

    const photoPreview = document.getElementById("photoPreview");
    if (photoPreview) {
        photoPreview.addEventListener("click", function () {
            document.getElementById("photoUpload").click();
        });
    }
});
