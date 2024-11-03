document.addEventListener("DOMContentLoaded", function () {
  const clickButton = document.getElementById("click-button");
  const clickCountDisplay = document.getElementById("click-count");
  const chartContainer = document.getElementById("click-chart");
  const chartTitle = document.getElementById("chart-title");

  let totalClicks = 0;
  let weeklyClicks = JSON.parse(localStorage.getItem("weeklyClicks")) || Array(7).fill(0);

  // Get the current day of the week (0 = Sunday, 6 = Saturday)
  const currentDay = new Date().getDay();

  // Initialize total clicks based on weekly data
  totalClicks = weeklyClicks.reduce((sum, count) => sum + count, 0);
  clickCountDisplay.textContent = `عدد النقرات: ${totalClicks}`;

  // Check if the daily limit has been reached
  function isDailyLimitReached() {
    return weeklyClicks[currentDay] >= 20;
  }

  // Update the button state
  function updateButtonState() {
    if (isDailyLimitReached()) {
      clickButton.disabled = true;
      clickButton.textContent = "لقد وصلت إلى الحد اليومي!";
    } else {
      clickButton.disabled = false;
      clickButton.textContent = "تذمرت!";
    }
  }

  // Increment click count
  clickButton.addEventListener("click", function () {
    if (!isDailyLimitReached()) {
      totalClicks++;
      weeklyClicks[currentDay]++;
      localStorage.setItem("weeklyClicks", JSON.stringify(weeklyClicks));

      clickCountDisplay.textContent = `عدد النقرات: ${totalClicks}`;
      renderChart();
      updateButtonState();
    }
  });

  // Render the chart based on weekly data
  function renderChart() {
    chartContainer.innerHTML = ""; // Clear previous chart

    const maxCount = Math.max(...weeklyClicks, 20); // Set maximum scale to 20

    const labels = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

    // Update chart title
    chartTitle.textContent = "عدد النقرات في اليوم";

    weeklyClicks.forEach((count, index) => {
      // Create bar
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = `${(count / maxCount) * 100}%`;
      bar.textContent = count > 0 ? count : "";

      // Create label
      const label = document.createElement("div");
      label.className = "bar-label";
      label.textContent = labels[index];

      // Container for bar and label
      const barContainer = document.createElement("div");
      barContainer.style.display = "flex";
      barContainer.style.flexDirection = "column";
      barContainer.style.alignItems = "center";
      barContainer.appendChild(bar);
      barContainer.appendChild(label);

      chartContainer.appendChild(barContainer);
    });
  }

  // Initial setup
  renderChart();
  updateButtonState();
});
