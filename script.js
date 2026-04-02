// Finance Dashboard - Complete JavaScript Implementation
class FinanceDashboard {
  constructor() {
    this.transactions = [
      { id: 1, date: '2024-01-15', amount: 2500, category: 'Salary', type: 'income', description: 'Monthly salary payment' },
      { id: 2, date: '2024-01-16', amount: 45.50, category: 'Groceries', type: 'expense', description: 'Weekly grocery shopping' },
      { id: 3, date: '2024-01-18', amount: 120.00, category: 'Dining', type: 'expense', description: 'Dinner with friends at restaurant' },
      { id: 4, date: '2024-01-20', amount: 89.75, category: 'Transportation', type: 'expense', description: 'Uber rides during week' },
      { id: 5, date: '2024-01-22', amount: 300.00, category: 'Entertainment', type: 'expense', description: 'Movie tickets and popcorn' },
      { id: 6, date: '2024-01-25', amount: 75.25, category: 'Groceries', type: 'expense', description: 'Weekend grocery shopping' },
      { id: 7, date: '2024-01-28', amount: 2000, category: 'Freelance', type: 'income', description: 'Web development project payment' },
      { id: 8, date: '2024-01-30', amount: 150.00, category: 'Utilities', type: 'expense', description: 'Monthly electricity bill' },
      { id: 9, date: '2024-02-01', amount: 2600, category: 'Salary', type: 'income', description: 'February salary payment' },
      { id: 10, date: '2024-02-03', amount: 60.75, category: 'Groceries', type: 'expense', description: 'Mid-week grocery shopping' },
      { id: 11, date: '2024-02-05', amount: 95.00, category: 'Dining', type: 'expense', description: 'Business lunch meeting' },
      { id: 12, date: '2024-02-08', amount: 35.50, category: 'Transportation', type: 'expense', description: 'Public transportation fares' }
    ];

    this.currentRole = 'viewer';
    this.filters = { search: '', category: 'all', type: 'all' };
    this.filteredTransactions = [...this.transactions];
    this.summary = this.calculateSummary(this.filteredTransactions);
    this.balanceChart = null;
    this.spendingChart = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderSummaryCards();
    this.renderTransactions();
    this.renderInsights();
    this.initCharts();
    this.updateAdminUI();
  }

  bindEvents() {
    // Role selector
    document.getElementById('roleSelector').addEventListener('change', (e) => {
      this.currentRole = e.target.value;
      this.updateAdminUI();
      this.renderTransactions();
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.filters.search = e.target.value.toLowerCase();
      this.applyFilters();
    });

    // Filters
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
      this.filters.category = e.target.value;
      this.applyFilters();
    });

    document.getElementById('typeFilter').addEventListener('change', (e) => {
      this.filters.type = e.target.value;
      this.applyFilters();
    });

    document.getElementById('clearFilters').addEventListener('click', () => {
      this.clearFilters();
    });

    // Filters toggle
    document.getElementById('filtersToggle').addEventListener('click', () => {
      const panel = document.getElementById('filtersPanel');
      panel.style.display = panel.style.display === 'none' ? 'grid' : 'none';
    });

    // Admin form
    document.getElementById('transactionForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTransaction();
    });
  }

  calculateSummary(transactions) {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    const spendingByCategory = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        spendingByCategory[t.category] = (spendingByCategory[t.category] || 0) + t.amount;
      });

    const highestSpendingCategory = Object.entries(spendingByCategory).length > 0
      ? Object.entries(spendingByCategory).reduce((a, b) => a[1] > b[1] ? a : b)
      : ['None', 0];

    const avgTransaction = transactions.length > 0 ? (totalIncome + totalExpenses) / transactions.length : 0;

    return {
      balance,
      income: totalIncome,
      expenses: totalExpenses,
      spendingByCategory,
      highestSpendingCategory: highestSpendingCategory[0],
      highestSpendingAmount: highestSpendingCategory[1],
      avgTransaction: Math.round(avgTransaction),
      transactionCount: transactions.length
    };
  }

  applyFilters() {
    this.filteredTransactions = this.transactions.filter(transaction => {
      const matchesSearch = !this.filters.search || 
        transaction.description.toLowerCase().includes(this.filters.search) ||
        transaction.category.toLowerCase().includes(this.filters.search);

      const matchesCategory = this.filters.category === 'all' || transaction.category === this.filters.category;
      const matchesType = this.filters.type === 'all' || transaction.type === this.filters.type;

      return matchesSearch && matchesCategory && matchesType;
    });

    this.summary = this.calculateSummary(this.filteredTransactions);
    this.renderSummaryCards();
    this.renderTransactions();
    this.renderInsights();
    this.updateCharts();
  }

  clearFilters() {
    this.filters = { search: '', category: 'all', type: 'all' };
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('typeFilter').value = 'all';
    this.applyFilters();
  }

  renderSummaryCards() {
    const cardsContainer = document.getElementById('summaryCards');
    const cards = [
      {
        title: 'Total Balance',
        value: this.formatCurrency(this.summary.balance),
        change: this.summary.balance >= 0 ? '+12.5%' : '-8.2%',
        changeClass: this.summary.balance >= 0 ? 'positive' : 'negative',
        icon: '💰',
        color: this.summary.balance >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600'
      },
      {
        title: 'Total Income',
        value: this.formatCurrency(this.summary.income),
        change: '+8.2%',
        changeClass: 'positive',
        icon: '📈',
        color: 'from-emerald-500 to-emerald-600'
      },
      {
        title: 'Total Expenses',
        value: this.formatCurrency(this.summary.expenses),
        change: '+15.3%',
        changeClass: 'negative',
        icon: '📉',
        color: 'from-red-500 to-red-600'
      }
    ];

    cardsContainer.innerHTML = cards.map(card => `
      <div class="summary-card" style="--gradient: ${card.color}">
        <div class="summary-content">
          <div class="summary-info">
            <h4>${card.title}</h4>
            <div class="summary-value">${card.value}</div>
            <div class="summary-change ${card.changeClass}">
              <span>${card.change}</span>
              <span>from last month</span>
            </div>
          </div>
          <div class="summary-icon" style="background: linear-gradient(135deg, ${card.color})">
            ${card.icon}
          </div>
        </div>
      </div>
    `).join('');
  }

  renderTransactions() {
    const container = document.getElementById('transactionsList');
    
    if (this.filteredTransactions.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No transactions found</h3>
          <p>Try adjusting your search or filters, or add new transactions as admin</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.filteredTransactions.map(transaction => {
      const date = new Date(transaction.date).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      
      return `
        <div class="transaction-item" data-id="${transaction.id}">
          <div>
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${transaction.description}</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">${transaction.category} • ${date}</div>
          </div>
          <div class="transaction-amount ${transaction.type}">
            ${this.formatCurrency(transaction.amount)}
          </div>
          <div class="transaction-type type-${transaction.type}">
            ${transaction.type.toUpperCase()}
          </div>
          ${this.currentRole === 'admin' ? `
            <div class="transaction-actions">
              <button class="action-btn edit-btn" title="Edit" data-id="${transaction.id}">
                ✏️
              </button>
              <button class="action-btn delete-btn" title="Delete" data-id="${transaction.id}">
                🗑️
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    // Bind action events
    if (this.currentRole === 'admin') {
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => this.editTransaction(e.target.dataset.id));
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => this.deleteTransaction(parseInt(e.target.dataset.id)));
      });
    }
  }

  renderInsights() {
    const container = document.getElementById('insightsGrid');
    
    const insights = [
      {
        icon: '👑',
        title: 'Top Spending Category',
        value: `${this.summary.highestSpendingCategory}: ${this.formatCurrency(this.summary.highestSpendingAmount)}`,
        color: 'from-orange-500 to-orange-600'
      },
      {
        icon: '📊',
        title: 'Average Transaction',
        value: this.formatCurrency(this.summary.avgTransaction),
        color: 'from-blue-500 to-blue-600'
      },
      {
        icon: '📈',
        title: `Total Transactions`,
        value: this.summary.transactionCount.toLocaleString(),
        color: 'from-purple-500 to-purple-600'
      }
    ];

    container.innerHTML = insights.map(insight => `
      <div class="insight-item" style="background: linear-gradient(135deg, ${insight.color}, rgba(255,255,255,0.5))">
        <div class="insight-icon" style="background: linear-gradient(135deg, ${insight.color})">
          ${insight.icon}
        </div>
        <div>
          <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem;">${insight.title}</div>
          <div style="font-size: 1.25rem; font-weight: 700;">${insight.value}</div>
        </div>
      </div>
    `).join('');
  }

  updateAdminUI() {
    const adminSection = document.getElementById('adminSection');
    adminSection.style.display = this.currentRole === 'admin' ? 'block' : 'none';
  }

  addTransaction() {
    const form = document.getElementById('transactionForm');
    const formData = new FormData(form);

    const newTransaction = {
      id: Date.now(),
      date: document.getElementById('dateInput').value,
      amount: parseFloat(document.getElementById('amountInput').value),
      category: document.getElementById('categoryInput').value,
      type: document.getElementById('typeInput').value,
      description: document.getElementById('descriptionInput').value
    };

    this.transactions.unshift(newTransaction);
    form.reset();
    document.getElementById('dateInput').valueAsDate = new Date();
    
    this.applyFilters();
    
    // Show success message
    this.showNotification('Transaction added successfully!', 'success');
  }

  deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.applyFilters();
      this.showNotification('Transaction deleted!', 'success');
    }
  }

  editTransaction(id) {
    // Simple edit - populate form for now (full inline editing could be added)
    const transaction = this.transactions.find(t => t.id === id);
    if (transaction) {
      document.getElementById('descriptionInput').value = transaction.description;
      document.getElementById('amountInput').value = transaction.amount;
      document.getElementById('dateInput').value = transaction.date;
      document.getElementById('categoryInput').value = transaction.category;
      document.getElementById('typeInput').value = transaction.type;
      
      this.showNotification('Edit form populated. Modify and add as new transaction.', 'info');
    }
  }

  initCharts() {
    this.initBalanceChart();
    this.initSpendingChart();
  }

  initBalanceChart() {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    this.balanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{
          label: 'Balance',
          data: [2450, 2800, 3200, 3560],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 4,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { color: '#f1f5f9' } },
          y: { 
            grid: { color: '#f1f5f9' },
            ticks: { color: '#64748b' }
          }
        }
      }
    });
  }

  initSpendingChart() {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    
    const spendingData = this.calculateSpendingChartData();
    
    this.spendingChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: spendingData.labels,
        datasets: [{
          data: spendingData.values,
          backgroundColor: [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
          ],
          borderWidth: 0,
          borderRadius: 8,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        }
      }
    });
  }

  calculateSpendingChartData() {
    const spending = this.summary.spendingByCategory;
    const sorted = Object.entries(spending)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      labels: sorted.map(([category]) => category),
      values: sorted.map(([, amount]) => amount)
    };
  }

  updateCharts() {
    const spendingData = this.calculateSpendingChartData();
    this.spendingChart.data.labels = spendingData.labels;
    this.spendingChart.data.datasets[0].data = spendingData.values;
    this.spendingChart.update('none');
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  showNotification(message, type = 'success') {
    // Simple notification (could be enhanced with toast library)
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#3b82f6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 1rem;
      box-shadow: var(--shadow-xl);
      z-index: 1000;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FinanceDashboard();
});

// Save to localStorage on unload (optional persistence)
window.addEventListener('beforeunload', () => {
  localStorage.setItem('financeTransactions', JSON.stringify(dashboard.transactions));
});

// Load from localStorage on init (optional)
const saved = localStorage.get