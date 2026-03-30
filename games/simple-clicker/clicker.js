const $ = (s) => document.querySelector(s);

const btn = $(".mainclick");
const pointsdisplay = $(".pointsdisplay");

btn.addEventListener("click", () => {
  game.addPoints(game.clickPower);
  game.totalClicks++;
});

function formatNumber(num) {
  function prefix(gt, suffix) {
    if (num.toString().length >= gt) {
      return (num / Number("1" + "0".repeat(gt - 1))).toFixed(2) + suffix;
    }
    return null;
  }

  const result = 
    prefix(64, "Vg") ||
    prefix(61, "Nod") ||
    prefix(58, "Ocd") ||
    prefix(55, "Spd") ||
    prefix(52, "Sxd") ||
    prefix(49, "Qid") ||
    prefix(46, "Qad") ||
    prefix(43, "Td") ||
    prefix(40, "Dd") ||
    prefix(37, "Ud") ||
    prefix(34, "Dc") ||
    prefix(31, "No") ||
    prefix(28, "Oc") ||
    prefix(25, "Sp") ||
    prefix(22, "Sx") ||
    prefix(19, "Qi") ||
    prefix(16, "Qa") ||
    prefix(13, "T") ||
    prefix(10, "B") ||
    prefix(7, "M") ||
    prefix(4, "K");
  
  return result || num;
}

class Game {
  constructor() {
    this.points = 0;
    this.interval = null;
    this.totalClicks = 0;
    this.clickPower = 1;
    this.pointsPerSecond = 0;
    this.upgrades = [];
    this.startTime = Date.now();
    this.timePlayed = 0;
    this.achievements = [];
    this.isLoading = true;
  }

  async afterInit() {
    this.loadGame();
    this.loadAchievements();
    this.setupSettings();
  }

  async loadAchievements() {
    try {
      const response = await fetch('achievements.txt');
      const text = await response.text();
      const achievementBlocks = text.split('===').filter(block => block.trim());
      
      this.achievements = achievementBlocks.map(block => {
        const lines = block.trim().split('\n');
        const achievement = {};
        
        lines.forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length > 0) {
            achievement[key.trim()] = valueParts.join(':').trim();
          }
        });
        
        return {
          name: achievement.Name,
          description: achievement.Desc,
          condition: achievement.Cond,
          unlocked: false
        };
      });
    } catch (error) {
      console.error('Failed to load achievements:', error);
      this.achievements = [];
    }
  }

  checkAchievements() {
    if (this.isLoading) return;
    
    this.achievements.forEach(achievement => {
      if (!achievement.unlocked) {
        let conditionMet = false;
        let shouldUnlock = false;
        
        if (achievement.condition.includes('clicks >= ')) {
          const required = parseInt(achievement.condition.match(/clicks >= (\d+)/)[1]);
          conditionMet = this.totalClicks >= required;
          shouldUnlock = conditionMet && this.totalClicks > required;
        } else if (achievement.condition.includes('upgradesBought >= ')) {
          const required = parseInt(achievement.condition.match(/upgradesBought >= (\d+)/)[1]);
          const totalUpgrades = this.upgrades.reduce((sum, upgrade) => sum + upgrade.bought, 0);
          conditionMet = totalUpgrades >= required;
          shouldUnlock = conditionMet && totalUpgrades >= required;
        } else if (achievement.condition.includes('timePlayed >= ')) {
          const required = parseInt(achievement.condition.match(/timePlayed >= (\d+)/)[1]);
          conditionMet = this.timePlayed >= required;
          shouldUnlock = conditionMet && this.timePlayed > required;
        }
        
        if (shouldUnlock && !achievement.unlocked) {
          achievement.unlocked = true;
          this.showAchievementNotification(achievement);
        }
      }
    });
  }

  showAchievementNotification(achievement) {
    if (achievement.unlocked) return;
    
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-content">
        <h3>New Achievement!</h3>
        <h4>${achievement.name}</h4>
        <p>${achievement.description}</p>
      </div>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28582a;
      color: white;
      font-weight: bold;
      border: 2px solid #1a3d1c;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  addPoints(amount) {
    this.points += amount;
    this.showPoints();
    this.updateShopButtons();
  }

  showPoints() {
    pointsdisplay.textContent = formatNumber(Math.floor(this.points));
  }

  updateShopButtons() {
    const buyButtons = document.querySelectorAll(".buy-btn");
    buyButtons.forEach((btn, index) => {
      const upgrade = this.upgrades[index];
      btn.disabled = !upgrade.isAffordable();
    });
  }

  async loadUpgradesFromFile() {
    try {
      const response = await fetch('upgrades.txt');
      const text = await response.text();
      const upgradeBlocks = text.split('===').filter(block => block.trim());
      
      const upgrades = [];
      upgradeBlocks.forEach(block => {
        const lines = block.trim().split('\n');
        const upgradeData = {};
        
        lines.forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length > 0) {
            upgradeData[key.trim()] = valueParts.join(':').trim();
          }
        });
        
        if (upgradeData.Name && upgradeData.Desc && upgradeData.Cost && upgradeData.Func) {
          const cost = parseInt(upgradeData.Cost);
          const effectString = upgradeData.Func;
          
          upgrades.push({
            name: upgradeData.Name,
            description: upgradeData.Desc,
            baseCost: cost,
            effectString: effectString,
            bought: 0
          });
        }
      });
      
      return upgrades;
    } catch (error) {
      console.error('Failed to load upgrades from file:', error);
      return this.getDefaultUpgrades();
    }
  }
  
  getDefaultUpgrades() {
    return [
      new Upgrade("Click Power", "Increases points per click", 10, () => {
        this.clickPower += 1;
      }),
      new Upgrade("Auto Clicker", "Generates 1 point per second", 50, () => {
        this.pointsPerSecond += 1;
      }),
      new Upgrade("Double Click", "Doubles your click power", 200, () => {
        this.clickPower *= 2;
      })
    ];
  }

  setupEventListeners() {
    const modalContent = document.querySelector(".modalcontent");

    if (modalContent) {
      modalContent.addEventListener("click", (e) => {
        if (e.target.classList.contains("buy-btn")) {
          const index = parseInt(e.target.dataset.upgradeIndex);
          this.buyUpgrade(index);
        }
      });
    } else {
      document.addEventListener("click", (e) => {
        if (e.target.classList.contains("buy-btn")) {
          const index = parseInt(e.target.dataset.upgradeIndex);
          this.buyUpgrade(index);
        }
      });
    }
  }

  async initializeUpgrades() {
    if (this.upgrades.length === 0) {
      const upgradeData = await this.loadUpgradesFromFile();
      this.upgrades = upgradeData.map(data => {
        const effect = this.createEffectFunction(data.effectString);
        const upgrade = new Upgrade(data.name, data.description, data.baseCost, effect);
        upgrade.effectString = data.effectString;
        return upgrade;
      });
    }
    
    this.setupEventListeners();
    this.renderUpgrades();
  }

  createEffectFunction(effectString) {
    if (effectString.includes('clickPower += ')) {
      const amount = parseInt(effectString.match(/clickPower \+= (\d+)/)[1]);
      return () => {
        this.clickPower += amount;
      };
    } else if (effectString.includes('pointsPerSecond += ')) {
      const amount = parseInt(effectString.match(/pointsPerSecond \+= (\d+)/)[1]);
      return () => {
        this.pointsPerSecond += amount;
      };
    } else if (effectString.includes('clickPower *= ')) {
      const multiplier = parseFloat(effectString.match(/clickPower \*= ([\d.]+)/)[1]);
      return () => {
        this.clickPower *= multiplier;
      };
    } else {
      return () => {};
    }
  }

  renderUpgrades() {
    const shopItems = document.querySelector(".shopitems");
    shopItems.innerHTML = "";

    this.upgrades.forEach((upgrade, index) => {
      const upgradeElement = document.createElement("div");
      upgradeElement.className = "upgrade-item";
      upgradeElement.innerHTML = `
                <div class="upgrade-info">
                    <h3>${upgrade.name}</h3>
                    <p>${upgrade.description}</p>
                    <p>Cost: ${formatNumber(Math.floor(upgrade.getCost()))} points</p>
                    <p>Owned: ${upgrade.bought}</p>
                </div>
                <button class="btn buy-btn" data-upgrade-index="${index}" ${!upgrade.isAffordable() ? "disabled" : ""} onclick="game.buyUpgrade(${index}); event.stopPropagation();">
                    Buy
                </button>
            `;

      shopItems.appendChild(upgradeElement);
    });
  }

  buyUpgrade(index) {
    const upgrade = this.upgrades[index];
    if (upgrade.isAffordable()) {
      this.points -= upgrade.getCost();
      upgrade.bought++;
      upgrade.effect();
      this.showPoints();
      this.renderUpgrades();
      this.updateStats();
    }
  }

  updateStats() {
    const statsHtml = `
            <div class="stat">
                <span class="statlabel">Click power:</span>
                <span class="statvalue">${this.clickPower}</span>
            </div>
            <div class="stat">
                <span class="statlabel">Total clicks:</span>
                <span class="statvalue">${this.totalClicks}</span>
            </div>
            <div class="stat">
                <span class="statlabel">Clicks per second:</span>
                <span class="statvalue">${this.pointsPerSecond}</span>
            </div>
            <div class="stat">
                <span class="statlabel">Time played:</span>
                <span class="statvalue">${Math.floor(this.timePlayed / 60)}:${(this.timePlayed % 60).toString().padStart(2, '0')}</span>
            </div>
        `;
    
    document.querySelector(".stats").innerHTML = statsHtml;
    
    const achievementsHtml = this.achievements.map(achievement => `
        <div class="achievement ${achievement.unlocked ? 'unlocked' : 'locked'}">
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
        </div>
    `).join('');
    
    document.querySelector(".achievements").innerHTML = achievementsHtml;
  }

  tick() {
    if (this.pointsPerSecond > 0) {
      this.addPoints(this.pointsPerSecond / 30);
    }
    this.timePlayed = Math.floor((Date.now() - this.startTime) / 1000);
    this.checkAchievements();
    this.updateStats();
  }

  setupSettings() {
    const darkToggle = document.getElementById("dark");
    const resetBtn = document.getElementById("reset");
    const exportBtn = document.getElementById("export");
    const importBtn = document.getElementById("import");
    
    darkToggle.checked = localStorage.getItem("darkTheme") === "true";
    this.applyDarkTheme(darkToggle.checked);

    darkToggle.addEventListener("change", () => {
      this.applyDarkTheme(darkToggle.checked);
      localStorage.setItem("darkTheme", darkToggle.checked);
    });

    resetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset all progress?")) {
        this.resetGame();
      }
    });

    exportBtn.addEventListener("click", () => {
      this.exportGame();
    });

    importBtn.addEventListener("click", () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.simpclicker';
      fileInput.onchange = (e) => {
        this.importGame(e.target.files[0]);
      };
      fileInput.click();
    });
  }

  applyDarkTheme(isDark) {
    if (isDark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }

  saveGame() {
    const saveData = {
      points: this.points,
      totalClicks: this.totalClicks,
      clickPower: this.clickPower,
      pointsPerSecond: this.pointsPerSecond,
      timePlayed: this.timePlayed,
      upgrades: this.upgrades.map((upgrade) => ({
        name: upgrade.name,
        description: upgrade.description,
        baseCost: upgrade.baseCost,
        bought: upgrade.bought,
        effectString: upgrade.effectString || ''
      })),
      achievements: this.achievements
    };
    localStorage.setItem("clickerSave", JSON.stringify(saveData));
  }

  loadGame() {
    const saveData = localStorage.getItem("clickerSave");
    if (saveData) {
      const data = JSON.parse(saveData);
      this.points = data.points || 0;
      this.totalClicks = data.totalClicks || 0;
      this.clickPower = data.clickPower || 1;
      this.pointsPerSecond = data.pointsPerSecond || 0;
      this.timePlayed = data.timePlayed || 0;

      if (data.upgrades && data.upgrades.length > 0) {
        this.upgrades = data.upgrades.map((upgradeData) => {
          const effect = this.createEffectFunction(upgradeData.effectString);
          const upgrade = new Upgrade(
            upgradeData.name,
            upgradeData.description,
            upgradeData.baseCost,
            effect,
          );
          upgrade.bought = upgradeData.bought;
          upgrade.effectString = upgradeData.effectString;
          return upgrade;
        });
        this.renderUpgrades();
      } else {
        this.initializeUpgrades();
      }

      if (data.achievements && data.achievements.length > 0) {
        this.achievements = data.achievements;
      } else {
        this.loadAchievements();
      }
    } else {
      this.loadAchievements();
    }
  }

  restoreUpgradeEffects() {
    let baseClickPower = 1;
    this.pointsPerSecond = 0;
    
    this.upgrades.forEach((upgrade) => {
      if (upgrade.effectString) {
        if (upgrade.effectString.includes('clickPower += ')) {
          const amount = parseInt(upgrade.effectString.match(/clickPower \+= (\d+)/)[1]);
          baseClickPower += (amount * upgrade.bought);
        } else if (upgrade.effectString.includes('pointsPerSecond += ')) {
          const amount = parseInt(upgrade.effectString.match(/pointsPerSecond \+= (\d+)/)[1]);
          this.pointsPerSecond += (amount * upgrade.bought);
        } else if (upgrade.effectString.includes('clickPower *= ')) {
          const multiplier = parseFloat(upgrade.effectString.match(/clickPower \*= ([\d.]+)/)[1]);
          baseClickPower *= Math.pow(multiplier, upgrade.bought);
        }
      }
    });
  }

  resetGame() {
    this.points = 0;
    this.totalClicks = 0;
    this.clickPower = 1;
    this.pointsPerSecond = 0;
    this.upgrades = [];
    this.timePlayed = 0;
    this.achievements = [];
    localStorage.removeItem("clickerSave");
    this.initializeUpgrades();
    this.showPoints();
    this.updateStats();
  }

  exportGame() {
    const saveData = {
      points: this.points,
      totalClicks: this.totalClicks,
      clickPower: this.clickPower,
      pointsPerSecond: this.pointsPerSecond,
      upgrades: this.upgrades.map((upgrade) => ({
        name: upgrade.name,
        description: upgrade.description,
        baseCost: upgrade.baseCost,
        bought: upgrade.bought,
      })),
    };

    const encodedData = btoa(JSON.stringify(saveData));

    const blob = new Blob([encodedData], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clicker-save-${new Date().toISOString().slice(0, 10)}.simpclicker`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importGame(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(atob(e.target.result));
        this.points = data.points || 0;
        this.totalClicks = data.totalClicks || 0;
        this.clickPower = data.clickPower || 1;
        this.pointsPerSecond = data.pointsPerSecond || 0;

        if (data.upgrades) {
          this.upgrades = data.upgrades.map((upgradeData) => {
            const effect = this.createEffectFunction(upgradeData.effectString);
            const upgrade = new Upgrade(
              upgradeData.name,
              upgradeData.description,
              upgradeData.baseCost,
              effect,
            );
            upgrade.bought = upgradeData.bought;
            upgrade.effectString = upgradeData.effectString;
            return upgrade;
          });
        }

        this.renderUpgrades();
        this.showPoints();
        this.updateStats();
        this.saveGame();
      } catch (error) {
        alert("Invalid save file!");
      }
    };
    reader.readAsText(file);
  }

  async start() {
    await this.initializeUpgrades();
    this.setupEventListeners();
    this.showPoints();
    this.updateStats();
    
    this.interval = setInterval(() => {
      this.tick();
    }, 30);

    setInterval(() => {
      this.saveGame();
    }, 5000);
    
    setTimeout(() => {
      this.checkAchievements();
    }, 1000);
    
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}

class Upgrade {
  constructor(name, description, cost, effect) {
    this.name = name;
    this.description = description;
    this.baseCost = cost;
    this.bought = 0;
    this.effect = effect;
  }

  buy() {
    if (this.isAffordable()) {
      game.points -= this.getCost();
      this.bought++;
      this.effect();
    }
  }

  getCost() {
    return this.baseCost * Math.pow(1.5, this.bought);
  }

  isAffordable() {
    return game.points >= this.getCost();
  }
}

window.game = new Game();
window.game.afterInit().then(() => {
  window.game.start();
});
