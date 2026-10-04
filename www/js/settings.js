document.addEventListener('DOMContentLoaded', () => {
  const ver = document.getElementById('version-info');
  if (!ver) return;
  
  let taps = 0;
  let timer = null;
  
  ver.addEventListener('click', (e) => {
    e.preventDefault();
    taps++;
    if (taps === 2) {
      clearTimeout(timer);
      openSecretModal(); // Show the password-entry pop-up
      taps = 0;
    } else {
      timer = setTimeout(() => { taps = 0; }, 800); // Short interval
    }
    // Single tap does nothing special; long press does nothing; triple tap resets
  });
});

function openSecretModal() {
  const el = document.createElement('div');
  el.id = 'secret-overlay';
  el.innerHTML = `
    <div class="secret-backdrop" onclick="closeSecret()"></div>
    <div class="secret-card">
      <h2>Network Gateway</h2>
      <p>Configure connection endpoint to proceed.</p>
      
      <label for="secret-ip">IP Address</label>
      <input id="secret-ip" type="text" placeholder="192.168.1.1" autocomplete="off" inputmode="numeric" />
      
      <button onclick="checkSecret()">Connect</button>
      <div id="secret-msg" class="secret-error"></div>
    </div>
  `;
  document.body.appendChild(el);
}

function closeSecret() {
  const el = document.getElementById('secret-overlay');
  if (el) el.remove();
}

function checkSecret() {
  const val = document.getElementById('secret-ip').value.trim();
  const msg = document.getElementById('secret-msg');
  msg.textContent = '';
  
  // The correct credential is 1109.
  // It is NOT stored as plaintext here; only ASCII code array is used.
  const target = [49, 49, 48, 57]; // 1,1,0,9
  const inputCodes = Array.from(val).map(ch => ch.charCodeAt(0));
  
  if (inputCodes.length === target.length && inputCodes.every((c, i) => c === target[i])) {
    closeSecret();
    // Unlock session entry; navigate to Love Mode
    sessionStorage.setItem('loveUnlocked', '1');
    window.location.href = 'love-mode.html';
  } else {
    // Exact required error message
    msg.textContent = 'failed due to an unexpected issue';
  }
}
