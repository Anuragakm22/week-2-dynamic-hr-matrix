// app.js - Dynamic SaaS Dashboard functionality (final version)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('userForm');
  const tbody = document.getElementById('usersTbody');
  const emptyMsg = document.getElementById('emptyMessage');
  const toast = document.getElementById('toast');

  const counters = {
    total: document.getElementById('countTotal'),
    accepted: document.getElementById('countAccepted'),
    rejected: document.getElementById('countRejected'),
    pending: document.getElementById('countPending')
  };
  const currentDate = document.getElementById("currentDate");
  const today = new Date();
  currentDate.textContent = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
});
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addApplicant();
    form.reset();
  });

  function addApplicant() {
    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const role = form.querySelector('select[name="role"]').value;
    const dept = form.querySelector('input[name="department"]').value.trim();
    const phone = form.querySelector('input[name="phone"]').value.trim();
    const date = form.querySelector('input[name="date"]').value;

    // Validation
    if (!name) return showToast('Name is required.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast('Enter a valid email.');
    if (!role) return showToast("Please select a role.");
    if (!dept) return showToast('Department is required.');
    if (!phone || phone.length < 10) return showToast('Phone number must be at least 10 digits.');
    if (!date) return showToast('Applied date is required.');

    const tr = document.createElement('tr');

    // Helper to create a cell
    function createCell(text) {
      const td = document.createElement('td');
      td.textContent = text;
      return td;
    }

    tr.appendChild(createCell(name));
    tr.appendChild(createCell(email));
    tr.appendChild(createCell(role));
    tr.appendChild(createCell(dept));
    tr.appendChild(createCell(phone));
    tr.appendChild(createCell(date));

    // Status cell
    const tdStatus = document.createElement('td');
    tdStatus.textContent = 'Pending';
    tdStatus.classList.add('status', 'pending');
    tr.appendChild(tdStatus);

    // Actions cell
    const tdActions = document.createElement('td');
    const actionsWrapper = document.createElement('div');
    actionsWrapper.className = 'row-actions';
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'btn toggle';
    toggleBtn.textContent = 'Toggle Status';
    toggleBtn.addEventListener('click', () => toggleStatus(tdStatus));
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteApplicant(tr));
    actionsWrapper.appendChild(toggleBtn);
    actionsWrapper.appendChild(deleteBtn);
    tdActions.appendChild(actionsWrapper);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
    updateCounters();
    showToast('Applicant added!');
    emptyMsg.style.display = 'none';
  }

  function toggleStatus(tdStatus) {
    if (tdStatus.classList.contains('pending')) {
      tdStatus.textContent = 'Accepted';
      tdStatus.className = 'status accepted';
    } else if (tdStatus.classList.contains('accepted')) {
      tdStatus.textContent = 'Rejected';
      tdStatus.className = 'status rejected';
    } else {
      tdStatus.textContent = 'Pending';
      tdStatus.className = 'status pending';
    }
    updateCounters();
    showToast('Status updated!');
  }

  function deleteApplicant(tr) {
    if (confirm("Delete applicant?")) {
      tr.remove();
      updateCounters();
      showToast('Applicant deleted.');
      if (tbody.children.length === 0) {
        emptyMsg.style.display = 'block';
      }
    } else {
      showToast('Deletion cancelled.');
    }
  }

  function updateCounters() {
    const rows = tbody.querySelectorAll('tr');
    counters.total.textContent = rows.length;
    counters.accepted.textContent = tbody.querySelectorAll('.accepted').length;
    counters.rejected.textContent = tbody.querySelectorAll('.rejected').length;
    counters.pending.textContent = tbody.querySelectorAll('.pending').length;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
});
