/* ============================================================
   EDIT THESE VALUES BEFORE SENDING
   ============================================================ */
const birthYear = 2004;
const birthMonth = 9;
const birthDay = 19;

const vintageSpeakerAudioTrackUrl = "Masakali Delhi 6 128 Kbps.mp3"; // e.g. "happy-birthday-instrumental.mp3"

const girlfriendPhotoUrls = [
  "photos/1.jpg",
  "photos/2.jpg",
  "photos/3.jpg",
  "photos/4.jpg",
  "photos/5.jpg",
  "photos/6.jpg",
  "photos/7.jpg",
  "photos/8.jpg",
  "photos/9.jpg",
  "photos/10.jpg",
  "photos/11.jpg",
  "photos/12.jpg",
  "photos/13.jpg",
  "photos/14.jpg",
  "photos/15.jpg",
  "photos/16.jpg",
  "photos/17.jpg",
  "photos/18.jpg",
  "photos/19.jpg",
  "photos/20.jpg",
  "photos/21.jpg",
  "photos/22.jpg"
];

const birthdayMessageText =
  "Happy Birthday to my favourite girl from miles away \u2665 Even though we're far apart, " +
  "I'm so grateful that distance has never changed our friendship. Thank you for being the kind, " +
  "caring, funny and wonderful person you are. You've been there through so many moments of my life, " +
  "and I honestly can't imagine my journey without you in it. \u2665\n\n" +
  "I hope this year brings you endless happiness, good health, exciting opportunities, and all the " +
  "love you deserve. May you keep smiling, chasing your dreams, and becoming the amazing person you're " +
  "meant to be.\n\n" +
  "I wish I could celebrate with you in person today, but until then, know that I'm sending you the " +
  "biggest virtual hug and all my best wishes.\n\n" +
  "Thank you for being such an incredible loved one . No matter how many miles separate us, you'll " +
  "always have a special place in my heart.\n\n" +
  "Have the most beautiful birthday Megha, you deserve it \u2665";

const floatingElementReactionMessages = [
  "you make me feel special in ways I can't explain",
  "your laugh is genuinely my favorite sound",
  "you're way funnier than you think you are",
  "being around you is just... easy",
  "you notice things most people don't",
  "you deserve every good thing coming your way"
];

/* ============================================================
   scene navigation
   ============================================================ */
function revealNextScene(sceneElementId) {
  document.querySelectorAll('.experienceScene').forEach(function (sceneElement) {
    sceneElement.classList.remove('isActive');
  });
  document.getElementById(sceneElementId).classList.add('isActive');
}

/* ============================================================
   utility: calculate current age from birth date
   ============================================================ */
function calculateCurrentAge(year, month, day) {
  const today = new Date();
  let age = today.getFullYear() - year;
  const hasHadBirthdayThisYear =
    (today.getMonth() + 1 > month) ||
    (today.getMonth() + 1 === month && today.getDate() >= day);
  if (!hasHadBirthdayThisYear) age--;
  return age;
}
const recipientCurrentAge = calculateCurrentAge(birthYear, birthMonth, birthDay);

/* ============================================================
   utility: throttle
   ============================================================ */
function throttle(callback, delayMs) {
  let lastCallTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCallTime >= delayMs) {
      lastCallTime = now;
      callback.apply(this, args);
    }
  };
}

/* ============================================================
   SCENE 0: password gate
   ------------------------------------------------------------
   Wrong guesses escalate the hint in three stages. Change
   correctPassword below to whatever you want the answer to be —
   comparison is case-insensitive so "utkarsh", "Utkarsh", or
   "UTKARSH" all work.
   ============================================================ */
const correctPassword = "utkarsh";
const passwordHintStages = [
  "Hint: your fav person's first name",
  "Hint: it starts with \u201cU\u201d",
  "Hint: Utk...."
];
let passwordWrongAttempts = 0;

const passwordInputEl = document.getElementById('passwordInput');
const passwordHintEl = document.getElementById('passwordHint');
const passwordFeedbackEl = document.getElementById('passwordFeedback');
const passwordCardEl = document.querySelector('#scenePasswordGate .paperCard');

function handlePasswordInputKeydown(keyEvent) {
  if (keyEvent.key === 'Enter') handlePasswordSubmit();
}

function handlePasswordSubmit() {
  const enteredValue = passwordInputEl.value.trim().toLowerCase();

  if (enteredValue === correctPassword) {
    passwordFeedbackEl.textContent = '';
    revealPhotoStripsAndBeginScrolling();
    revealNextScene('sceneConsent');
    return;
  }

  passwordWrongAttempts++;
  const hintStageIndex = Math.min(passwordWrongAttempts, passwordHintStages.length - 1);
  passwordHintEl.textContent = passwordHintStages[hintStageIndex];
  passwordFeedbackEl.textContent = "That's not it — try again 🤔";

  passwordCardEl.classList.remove('isShaking');
  void passwordCardEl.offsetWidth; // force reflow so the shake can replay
  passwordCardEl.classList.add('isShaking');

  passwordInputEl.value = '';
  passwordInputEl.focus();
}

/* ============================================================
   side photo strips
   ============================================================ */
function buildPlaceholderPhotoDataUri(colorHex) {
  const svgMarkup =
    "<svg xmlns='http://www.w3.org/2000/svg' width='58' height='58'>" +
    "<rect width='58' height='58' rx='8' fill='" + colorHex + "'/></svg>";
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgMarkup);
}

// Fisher–Yates — returns a new shuffled array, leaves the original untouched
// so the left and right strips can each get their own independent order.
function shuffleArrayCopy(sourceArray) {
  const shuffled = sourceArray.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

function fillPhotoStripWithPlaceholders(trackElement) {
  const placeholderColors = ['#E8A0A0', '#A8C3A0', '#F2CB6C', '#E76F51', '#C9A0E8', '#A6CBEA'];
  const photoUrlsToUse = girlfriendPhotoUrls.length
    ? girlfriendPhotoUrls
    : placeholderColors.map(buildPlaceholderPhotoDataUri);

  // shuffle once per strip, then double *that same* shuffled order — doubling
  // an already-shuffled array (rather than shuffling twice) is what keeps the
  // seam invisible when the infinite scroll loops back to the top
  const shuffledPhotoUrls = shuffleArrayCopy(photoUrlsToUse);
  const doubledForSeamlessLoop = shuffledPhotoUrls.concat(shuffledPhotoUrls);

  trackElement.innerHTML = doubledForSeamlessLoop
    .map(function (url) {
      return '<div class="polaroidFrame"><img src="' + url + '" alt="" loading="eager"><span class="polaroidCaption">Love you</span></div>';
    })
    .join('');
}
fillPhotoStripWithPlaceholders(document.getElementById('leftPhotoStripTrack'));
fillPhotoStripWithPlaceholders(document.getElementById('rightPhotoStripTrack'));

/* ------------------------------------------------------------
   Hover zoom — grows the *whole polaroid* (white border + deep
   bottom margin, not just the photo) into a floating preview
   anchored where the cursor is. The preview frame's padding is
   always a fixed fraction of its own width, so it stays looking
   like a polaroid at both the small in-strip size and the big
   floating size, and morphs smoothly between the two.
   ------------------------------------------------------------ */
function initializePhotoStripZoomPreview() {
  const POLAROID_SIDE_PADDING_RATIO = 0.065;   // left/right/top border thickness
  const POLAROID_BOTTOM_PADDING_RATIO = 0.174; // deeper bottom border, the classic polaroid look

  const zoomPreviewFrame = document.createElement('div');
  zoomPreviewFrame.className = 'photoZoomPreview';
  const zoomPreviewImage = document.createElement('img');
  const zoomPreviewCaption = document.createElement('span');
  zoomPreviewCaption.className = 'polaroidCaption';
  zoomPreviewCaption.textContent = 'Love you';
  zoomPreviewFrame.appendChild(zoomPreviewImage);
  zoomPreviewFrame.appendChild(zoomPreviewCaption);
  document.body.appendChild(zoomPreviewFrame);

  let currentSourceFrame = null;
  let settleTimeoutId = null;

  function getEnlargedPreviewWidth() {
    if (window.innerWidth <= 560) return 148;
    if (window.innerWidth <= 900) return 180;
    return 230;
  }

  // Snaps the preview to a rect with no transition (used to plant it exactly
  // on top of the thumbnail before growing it), or animates to a rect when
  // withTransition is true — this snap-then-animate pair is what makes the
  // polaroid itself appear to morph in size instead of a new box popping in.
  function setPreviewRect(left, top, width, opacity, withTransition) {
    const sidePadding = Math.round(width * POLAROID_SIDE_PADDING_RATIO);
    const bottomPadding = Math.round(width * POLAROID_BOTTOM_PADDING_RATIO);
    const height = width - sidePadding + bottomPadding;

    zoomPreviewFrame.style.transitionProperty = withTransition
      ? 'left, top, width, height, padding, opacity'
      : 'none';
    zoomPreviewFrame.style.left = left + 'px';
    zoomPreviewFrame.style.top = top + 'px';
    zoomPreviewFrame.style.width = width + 'px';
    zoomPreviewFrame.style.height = height + 'px';
    zoomPreviewFrame.style.padding = sidePadding + 'px ' + sidePadding + 'px ' + bottomPadding + 'px ' + sidePadding + 'px';
    zoomPreviewFrame.style.opacity = opacity;
  }

  document.querySelectorAll('.photoStripTrack').forEach(function (trackElement) {
    trackElement.addEventListener('mouseover', function (hoverEvent) {
      const hoveredFrame = hoverEvent.target.closest('.polaroidFrame');
      if (!hoveredFrame) return;
      clearTimeout(settleTimeoutId);
      currentSourceFrame = hoveredFrame;

      const sourceBounds = hoveredFrame.getBoundingClientRect();
      zoomPreviewImage.src = hoveredFrame.querySelector('img').src;

      // plant the preview exactly over the thumbnail polaroid, same size, instantly
      setPreviewRect(sourceBounds.left, sourceBounds.top, sourceBounds.width, 0, false);
      void zoomPreviewFrame.offsetWidth; // force reflow so the start rect registers

      const previewWidth = getEnlargedPreviewWidth();
      let previewLeft = sourceBounds.left + sourceBounds.width / 2 - previewWidth / 2;
      previewLeft = Math.max(8, Math.min(previewLeft, window.innerWidth - previewWidth - 8));
      const previewHeight = previewWidth - Math.round(previewWidth * POLAROID_SIDE_PADDING_RATIO) + Math.round(previewWidth * POLAROID_BOTTOM_PADDING_RATIO);
      let previewTop = sourceBounds.top + sourceBounds.height / 2 - previewHeight / 2;
      previewTop = Math.max(8, Math.min(previewTop, window.innerHeight - previewHeight - 8));

      // then grow it into the enlarged preview — the actual morph
      setPreviewRect(previewLeft, previewTop, previewWidth, 1, true);
      zoomPreviewFrame.classList.add('isVisible');
    });

    trackElement.addEventListener('mouseout', function (hoverEvent) {
      const leftFrame = hoverEvent.target.closest('.polaroidFrame');
      if (!leftFrame || leftFrame !== currentSourceFrame) return;

      // shrink back down onto the thumbnail's current position before hiding
      const sourceBounds = leftFrame.getBoundingClientRect();
      setPreviewRect(sourceBounds.left, sourceBounds.top, sourceBounds.width, 0, true);
      zoomPreviewFrame.classList.remove('isVisible');

      settleTimeoutId = setTimeout(function () {
        currentSourceFrame = null;
      }, 380);
    });
  });
}
initializePhotoStripZoomPreview();

function revealPhotoStripsAndBeginScrolling() {
  const leftStrip = document.getElementById('leftPhotoStrip');
  const rightStrip = document.getElementById('rightPhotoStrip');
  leftStrip.classList.add('isRevealed');
  rightStrip.classList.add('isRevealed');
  setTimeout(function () {
    leftStrip.classList.add('isScrolling');
    rightStrip.classList.add('isScrolling');
  }, 700);
}

/* ============================================================
   SCENE 1: consent (yes / no with evading no-button)
   ============================================================ */
let noButtonClickCount = 0;
let noButtonIsEvading = false;
const noConsentButton = document.getElementById('noConsentButton');
const yesConsentButton = document.getElementById('yesConsentButton');
const consentButtonRow = document.querySelector('#sceneConsent .consentButtonRow');

function handleYesButtonClick() {
  if (window.confetti) confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  revealNextScene('sceneStartDecoration');
}

function handleNoButtonClick() {
  if (noButtonIsEvading) return;
  noButtonClickCount++;
  const growthScale = Math.min(1 + noButtonClickCount * 0.28, 2.6);
  yesConsentButton.style.transform = 'scale(' + growthScale + ')';

  if (noButtonClickCount >= 3) {
    beginNoButtonEvasion();
  } else {
    relocateNoButtonRandomly(true); // small nearby hop, still easily clickable
  }
}

function switchNoButtonToFreePositioning() {
  if (noConsentButton.classList.contains('isRoaming')) return;
  const rowBounds = consentButtonRow.getBoundingClientRect();
  const buttonBounds = noConsentButton.getBoundingClientRect();
  noConsentButton.classList.add('isRoaming');
  noConsentButton.style.left = (buttonBounds.left - rowBounds.left) + 'px';
  noConsentButton.style.top = (buttonBounds.top - rowBounds.top) + 'px';
}

function relocateNoButtonRandomly(useSmallHop) {
  switchNoButtonToFreePositioning();
  const rowBounds = consentButtonRow.getBoundingClientRect();
  const buttonBounds = noConsentButton.getBoundingClientRect();
  const maxLeft = Math.max(0, rowBounds.width - buttonBounds.width);
  const maxTop = Math.max(0, rowBounds.height - buttonBounds.height);

  let nextLeft, nextTop;
  if (useSmallHop) {
    const currentLeft = parseFloat(noConsentButton.style.left) || 0;
    const currentTop = parseFloat(noConsentButton.style.top) || 0;
    nextLeft = Math.min(Math.max(currentLeft + (Math.random() * 140 - 70), 0), maxLeft);
    nextTop = Math.min(Math.max(currentTop + (Math.random() * 50 - 25), 0), maxTop);
  } else {
    nextLeft = Math.random() * maxLeft;
    nextTop = Math.random() * maxTop;
  }
  noConsentButton.style.left = nextLeft + 'px';
  noConsentButton.style.top = nextTop + 'px';
}

function beginNoButtonEvasion() {
  if (noButtonIsEvading) return;
  noButtonIsEvading = true;
  noConsentButton.classList.add('isEvadingFast');
  relocateNoButtonRandomly(false);
  noConsentButton.style.pointerEvents = 'none';
  noConsentButton.style.opacity = '0.85';

  document.addEventListener('mousemove', handleCursorMovementForEvasion);
}

const handleCursorMovementForEvasion = throttle(function (mouseEvent) {
  if (!noButtonIsEvading) return;
  const buttonBounds = noConsentButton.getBoundingClientRect();
  const buttonCenterX = buttonBounds.left + buttonBounds.width / 2;
  const buttonCenterY = buttonBounds.top + buttonBounds.height / 2;
  const distanceFromCursor = Math.hypot(mouseEvent.clientX - buttonCenterX, mouseEvent.clientY - buttonCenterY);
  if (distanceFromCursor < 90) relocateNoButtonRandomly(false);
}, 50);

/* ============================================================
   SCENE 2: start decoration
   ============================================================ */
function handleStartDecorationClick() {
  const startButton = document.getElementById('startDecorationButton');
  startButton.classList.add('isFadingOut');
  setTimeout(function () {
    revealNextScene('sceneRoomDecoration');
    beginRoomDecorationSequence();
  }, 500);
}

/* ============================================================
   SCENE 3: room decoration sequence
   ============================================================ */
function buildBuntingBanner() {
  const bannerText = 'HAPPY BIRTHDAY';
  const flagColors = ['#E76F51', '#A8C3A0', '#F2CB6C', '#E8A0A0', '#C9A0E8', '#A6CBEA'];
  const buntingContainer = document.createElement('div');
  buntingContainer.className = 'buntingBanner';

  const letters = bannerText.split('').filter(function (character) { return character !== ' '; });
  const totalLetters = letters.length;
  const curveDipAmount = 16; // px — how far the middle of the banner sags below the ends

  const stringSvg = document.createElement('div');
  stringSvg.style.position = 'absolute';
  stringSvg.style.top = '-14px';
  stringSvg.style.left = '-14px';
  stringSvg.style.right = '-14px';
  stringSvg.style.height = '30px';
  stringSvg.style.zIndex = '-1';
  stringSvg.innerHTML =
    '<svg viewBox="0 0 100 30" preserveAspectRatio="none" style="width:100%; height:100%;">' +
    '<path d="M0 8 Q50 26 100 8" stroke="#2b2420" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
    '</svg>';
  buntingContainer.appendChild(stringSvg);

  let letterIndex = 0;
  bannerText.split('').forEach(function (character) {
    if (character === ' ') {
      const spacer = document.createElement('div');
      spacer.style.width = '10px';
      buntingContainer.appendChild(spacer);
      return;
    }
    const curveFraction = totalLetters > 1 ? letterIndex / (totalLetters - 1) : 0.5;
    const verticalOffset = curveDipAmount * Math.sin(Math.PI * curveFraction);

    const flagWrap = document.createElement('div');
    flagWrap.className = 'buntingFlagWrap';
    flagWrap.style.transform = 'translateY(' + verticalOffset + 'px)';

    const flag = document.createElement('div');
    flag.className = 'buntingFlag';
    flag.textContent = character;
    flag.style.background = flagColors[letterIndex % flagColors.length];
    flag.style.animationDelay = (letterIndex * 0.08) + 's, ' + (letterIndex * 0.15) + 's';

    flagWrap.appendChild(flag);
    buntingContainer.appendChild(flagWrap);
    letterIndex++;
  });
  return buntingContainer;
}

function computeQuadraticBezierPoint(startPoint, controlPoint, endPoint, t) {
  const oneMinusT = 1 - t;
  return {
    x: oneMinusT * oneMinusT * startPoint.x + 2 * oneMinusT * t * controlPoint.x + t * t * endPoint.x,
    y: oneMinusT * oneMinusT * startPoint.y + 2 * oneMinusT * t * controlPoint.y + t * t * endPoint.y
  };
}

function buildFairyLightsSvg() {
  const viewBoxWidth = 1000;
  const wireBaseY = 12;
  const wireDipAmount = 48;
  const swagSegmentCount = 6;
  const bulbsPerSegment = 4;
  const segmentWidth = viewBoxWidth / swagSegmentCount;

  const anchorPoints = [];
  for (let anchorIndex = 0; anchorIndex <= swagSegmentCount; anchorIndex++) {
    anchorPoints.push({ x: anchorIndex * segmentWidth, y: wireBaseY });
  }

  let wirePathData = 'M ' + anchorPoints[0].x + ' ' + anchorPoints[0].y;
  let bulbMarkup = '';
  let bulbIndex = 0;

  for (let segmentIndex = 0; segmentIndex < swagSegmentCount; segmentIndex++) {
    const segmentStart = anchorPoints[segmentIndex];
    const segmentEnd = anchorPoints[segmentIndex + 1];
    const segmentControlPoint = { x: (segmentStart.x + segmentEnd.x) / 2, y: wireBaseY + wireDipAmount };
    wirePathData += ' Q ' + segmentControlPoint.x + ' ' + segmentControlPoint.y + ', ' + segmentEnd.x + ' ' + segmentEnd.y;

    for (let bulbInSegment = 1; bulbInSegment <= bulbsPerSegment; bulbInSegment++) {
      const bulbFraction = bulbInSegment / (bulbsPerSegment + 1);
      const bulbPoint = computeQuadraticBezierPoint(segmentStart, segmentControlPoint, segmentEnd, bulbFraction);
      bulbMarkup +=
        '<circle class="fairyLightBulb" cx="' + bulbPoint.x + '" cy="' + bulbPoint.y + '" r="7" ' +
        'style="animation-delay:' + (bulbIndex * 0.14) + 's"></circle>';
      bulbIndex++;
    }
  }

  return (
    '<svg viewBox="0 0 ' + viewBoxWidth + ' 90" preserveAspectRatio="none" style="width:100%; height:80px; display:block;">' +
    '<path d="' + wirePathData + '" stroke="#2b2420" stroke-width="1" fill="none" stroke-linecap="round"/>' +
    bulbMarkup +
    '</svg>'
  );
}

function buildHangingLanternSvg(fillColor) {
  return `
    <svg viewBox="0 0 60 90" width="52">
      <line x1="30" y1="0" x2="30" y2="14" stroke="#7a6f5c" stroke-width="2"/>
      <ellipse cx="30" cy="45" rx="24" ry="30" fill="${fillColor}" stroke="#3A3226" stroke-width="1.5"/>
      <line x1="10" y1="30" x2="10" y2="60" stroke="#3A3226" stroke-width="1" opacity="0.35"/>
      <line x1="20" y1="18" x2="20" y2="72" stroke="#3A3226" stroke-width="1" opacity="0.35"/>
      <line x1="30" y1="15" x2="30" y2="75" stroke="#3A3226" stroke-width="1" opacity="0.35"/>
      <line x1="40" y1="18" x2="40" y2="72" stroke="#3A3226" stroke-width="1" opacity="0.35"/>
      <line x1="50" y1="30" x2="50" y2="60" stroke="#3A3226" stroke-width="1" opacity="0.35"/>
      <ellipse cx="30" cy="75" rx="6" ry="5" fill="#3A3226"/>
    </svg>
  `;
}

function buildRealisticBalloonSvg(bodyColorLight, bodyColorDark, gradientId) {
  return `
    <svg viewBox="0 0 100 300" style="width:100%; height:auto; display:block;">
      <defs>
        <radialGradient id="${gradientId}" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stop-color="${bodyColorLight}" />
          <stop offset="100%" stop-color="${bodyColorDark}" />
        </radialGradient>
      </defs>
      <path d="M50 4 C22 4 2 32 2 62 C2 92 24 116 46 132 L50 145 L54 132 C76 116 98 92 98 62 C98 32 78 4 50 4 Z"
            fill="url(#${gradientId})" stroke="#3A3226" stroke-width="1.5"/>
      <ellipse cx="34" cy="34" rx="12" ry="18" fill="#ffffff" opacity="0.32" transform="rotate(-18 34 34)"/>
      <path d="M46 143 L54 143 L50 155 Z" fill="${bodyColorDark}" stroke="#3A3226" stroke-width="1"/>
      <path d="M50 155 Q40 200 54 240 Q62 270 46 296" stroke="#6b6252" stroke-width="1.5" fill="none"/>
    </svg>
  `;
}

function beginRoomDecorationSequence() {
  document.getElementById('roomDecorationStatusCard').style.display = 'flex';
  const roomBackWall = document.getElementById('roomBackWall');

  const fairyLightsContainer = document.createElement('div');
  fairyLightsContainer.className = 'fairyLightsContainer';
  fairyLightsContainer.innerHTML = buildFairyLightsSvg();
  roomBackWall.appendChild(fairyLightsContainer);

  setTimeout(function () {
    roomBackWall.appendChild(buildBuntingBanner());
  }, 300);

  const lanternColors = ['#E76F51', '#F2CB6C', '#A8C3A0', '#C9A0E8'];
  const lanternPositions = [
    { top: '18%', left: '8%' },
    { top: '14%', left: '28%' },
    { top: '16%', right: '26%' },
    { top: '20%', right: '8%' }
  ];
  lanternPositions.forEach(function (position, index) {
    setTimeout(function () {
      const lantern = document.createElement('div');
      lantern.className = 'hangingLantern';
      Object.assign(lantern.style, position);
      lantern.style.animationDelay = '0s, ' + (index * 0.3) + 's';
      lantern.innerHTML = buildHangingLanternSvg(lanternColors[index % lanternColors.length]);
      roomBackWall.appendChild(lantern);
    }, 900 + index * 200);
  });

  const balloonColorPairs = [
    ['#F49080', '#E76F51'],
    ['#C0DAB8', '#A8C3A0'],
    ['#F7DA96', '#F2CB6C'],
    ['#F0BEBE', '#E8A0A0'],
    ['#DABBEF', '#C9A0E8']
  ];
  const balloonPositions = [
    { top: '30%', left: '6%' },
    { top: '45%', left: '18%' },
    { top: '32%', right: '10%' },
    { top: '48%', right: '20%' },
    { top: '38%', left: '42%' }
  ];
  balloonPositions.forEach(function (position, index) {
    setTimeout(function () {
      const balloon = document.createElement('div');
      balloon.className = 'roomBalloon';
      Object.assign(balloon.style, position);
      balloon.style.animationDelay = (index * 0.2) + 's, ' + (index * 0.35) + 's';
      const [lightShade, darkShade] = balloonColorPairs[index % balloonColorPairs.length];
      balloon.innerHTML = buildRealisticBalloonSvg(lightShade, darkShade, 'balloonGradient' + index);
      roomBackWall.appendChild(balloon);
      if (window.confetti) {
        confetti({ particleCount: 14, spread: 35, startVelocity: 18, origin: { x: Math.random(), y: 0.3 } });
      }
    }, 1700 + index * 250);
  });

  const vintageSpeaker = document.createElement('div');
  vintageSpeaker.className = 'vintageSpeaker';
  vintageSpeaker.id = 'vintageSpeaker';
  vintageSpeaker.innerHTML = `
    <svg viewBox="0 0 170 130" style="width:100%; height:auto; display:block;">
      <defs>
        <radialGradient id="hornBrassGradient" cx="35%" cy="35%" r="75%">
          <stop offset="0%" stop-color="#F3D896"/>
          <stop offset="55%" stop-color="#C9974B"/>
          <stop offset="100%" stop-color="#8B6B2E"/>
        </radialGradient>
        <linearGradient id="woodBoxGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#6b4a34"/>
          <stop offset="100%" stop-color="#3a2418"/>
        </linearGradient>
        <radialGradient id="reproducerGradient" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stop-color="#e8e4dc"/>
          <stop offset="100%" stop-color="#8a8378"/>
        </radialGradient>
      </defs>

      <!-- fluted brass horn -->
      <path d="M78 55 C 60 20, 20 5, 5 30 C -5 45, 0 65, 15 75 C 30 85, 55 78, 78 55 Z"
            fill="url(#hornBrassGradient)" stroke="#5c451f" stroke-width="1.5"/>
      <g stroke="#8B6B2E" stroke-width="0.8" opacity="0.6">
        <line x1="78" y1="55" x2="5" y2="30"/>
        <line x1="78" y1="55" x2="0" y2="48"/>
        <line x1="78" y1="55" x2="4" y2="63"/>
        <line x1="78" y1="55" x2="16" y2="74"/>
        <line x1="78" y1="55" x2="35" y2="80"/>
        <line x1="78" y1="55" x2="55" y2="76"/>
      </g>

      <!-- curved brass elbow down to the reproducer -->
      <path d="M78 55 C 90 60, 97 68, 100 78" fill="none" stroke="#C9974B" stroke-width="6" stroke-linecap="round"/>
      <path d="M78 55 C 90 60, 97 68, 100 78" fill="none" stroke="#8B6B2E" stroke-width="1.2"/>
      <circle cx="100" cy="79" r="6.5" fill="url(#reproducerGradient)" stroke="#5c554a" stroke-width="1"/>

      <!-- wooden box base -->
      <rect x="95" y="90" width="66" height="34" rx="3" fill="url(#woodBoxGradient)" stroke="#2b1c12" stroke-width="1.2"/>
      <rect x="95" y="90" width="66" height="7" rx="2" fill="#7a5940"/>

      <!-- turntable + record -->
      <g class="recordDisc">
        <circle cx="128" cy="93" r="25" fill="#17130f" stroke="#2b2420" stroke-width="1"/>
        <circle cx="128" cy="93" r="19" fill="none" stroke="#3a332c" stroke-width="0.6"/>
        <circle cx="128" cy="93" r="13" fill="none" stroke="#3a332c" stroke-width="0.6"/>
        <circle cx="128" cy="93" r="7" fill="#7a2f3d" stroke="#5c2330" stroke-width="0.8"/>
        <circle cx="128" cy="93" r="1.4" fill="#C9974B"/>
      </g>

      <!-- hand crank -->
      <circle cx="152" cy="112" r="3" fill="#2b2420"/>
      <line x1="152" y1="112" x2="163" y2="120" stroke="#2b2420" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="163" cy="120" r="3.5" fill="#1c1712"/>

      <!-- base shadow -->
      <ellipse cx="128" cy="126" rx="42" ry="4" fill="#000" opacity="0.15"/>
    </svg>
    <button class="speakerPlayPauseButton" id="speakerPlayPauseButton" onclick="toggleVintageSpeakerPlayback()">▶</button>
  `;
  setTimeout(function () { roomBackWall.appendChild(vintageSpeaker); }, 2400);

  const totalSequenceDuration = 2400 + balloonPositions.length * 250 + 1400;
  setTimeout(function () {
    transitionRoomStatusCardToCakeCard();
  }, totalSequenceDuration);
}

function transitionRoomStatusCardToCakeCard() {
  const statusCard = document.getElementById('roomDecorationStatusCard');
  const cakeCard = document.getElementById('birthdayCakeCard');
  statusCard.classList.add('isFadingOut');
  setUpBirthdayCake();
  setTimeout(function () {
    statusCard.style.display = 'none';
    cakeCard.classList.add('isVisible');
  }, 400);
}

let vintageSpeakerIsPlaying = false;
let speakerEmojiSpawnIntervalId = null;
const speakerFloatingEmojiOptions = ['🎵', '🎶', '♪', '🤍', '💛'];

function spawnSpeakerFloatingEmoji() {
  const vintageSpeaker = document.getElementById('vintageSpeaker');
  if (!vintageSpeaker) return;
  const speakerBounds = vintageSpeaker.getBoundingClientRect();

  const floatingEmoji = document.createElement('div');
  floatingEmoji.className = 'speakerFloatingEmoji';
  floatingEmoji.textContent =
    speakerFloatingEmojiOptions[Math.floor(Math.random() * speakerFloatingEmojiOptions.length)];
  floatingEmoji.style.left = (speakerBounds.left + speakerBounds.width * 0.28 + Math.random() * 20 - 10) + 'px';
  floatingEmoji.style.top = (speakerBounds.top + speakerBounds.height * 0.15) + 'px';
  floatingEmoji.style.setProperty('--driftX', (Math.random() * 30 - 15) + 'px');

  document.body.appendChild(floatingEmoji);
  setTimeout(function () { floatingEmoji.remove(); }, 2700);
}

function startSpeakerEmojiEmission() {
  if (speakerEmojiSpawnIntervalId) return;
  spawnSpeakerFloatingEmoji();
  speakerEmojiSpawnIntervalId = setInterval(spawnSpeakerFloatingEmoji, 650);
}

function stopSpeakerEmojiEmission() {
  clearInterval(speakerEmojiSpawnIntervalId);
  speakerEmojiSpawnIntervalId = null;
}

function toggleVintageSpeakerPlayback() {
  const vintageSpeaker = document.getElementById('vintageSpeaker');
  const playPauseButton = document.getElementById('speakerPlayPauseButton');
  const audioElement = document.getElementById('vintageSpeakerAudioElement');

  if (!vintageSpeakerAudioTrackUrl) {
    const nowPlaying = vintageSpeaker.classList.toggle('isPlaying');
    playPauseButton.textContent = nowPlaying ? '⏸' : '▶';
    if (nowPlaying) startSpeakerEmojiEmission(); else stopSpeakerEmojiEmission();
    return;
  }
  if (!audioElement.src) audioElement.src = vintageSpeakerAudioTrackUrl;
  vintageSpeakerIsPlaying = !vintageSpeakerIsPlaying;
  if (vintageSpeakerIsPlaying) {
    audioElement.play().catch(function () {});
    vintageSpeaker.classList.add('isPlaying');
    playPauseButton.textContent = '⏸';
    startSpeakerEmojiEmission();
  } else {
    audioElement.pause();
    vintageSpeaker.classList.remove('isPlaying');
    playPauseButton.textContent = '▶';
    stopSpeakerEmojiEmission();
  }
}

/* ============================================================
   SCENE 4: cake
   ============================================================ */
function buildPipedBorderDots(containerElement, dotCount) {
  for (let dotIndex = 0; dotIndex < dotCount; dotIndex++) {
    const dot = document.createElement('span');
    containerElement.appendChild(dot);
  }
}
function buildCakeDripShapes(containerElement, dripCount) {
  for (let dripIndex = 0; dripIndex < dripCount; dripIndex++) {
    const drip = document.createElement('span');
    containerElement.appendChild(drip);
  }
}

function setUpBirthdayCake() {
  buildPipedBorderDots(document.getElementById('topTierPipedBorder'), 8);
  buildPipedBorderDots(document.getElementById('bottomTierPipedBorder'), 11);
  buildCakeDripShapes(document.getElementById('bottomTierDrip'), 9);
}

function handleBlowCandleClick() {
  const cakeAssembly = document.getElementById('cakeAssembly');
  if (cakeAssembly.classList.contains('isCandleBlownOut')) return;
  cakeAssembly.classList.add('isCandleBlownOut');
  document.getElementById('blowCandleButton').style.display = 'none';

  if (window.confetti) {
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.5 } });
  }

  transitionCakeCardToFinalMessage();
}

function transitionCakeCardToFinalMessage() {
  const cakeCard = document.getElementById('birthdayCakeCard');
  const messageCard = document.getElementById('finalMessageCard');
  cakeCard.classList.remove('isVisible');
  cakeCard.style.display = 'none';
  messageCard.classList.add('isVisible');
  beginFinalMessageSequence();
}

/* ============================================================
   SCENE 5: final message
   ============================================================ */
function typewriteBirthdayMessage(fullText, targetElement, onComplete) {
  targetElement.innerHTML = '';
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'typewriterCursor';
  let currentIndex = 0;

  function typeNextCharacter() {
    if (currentIndex < fullText.length) {
      targetElement.textContent = fullText.slice(0, currentIndex + 1);
      targetElement.appendChild(cursorSpan);
      currentIndex++;
      const randomDelay = 28 + Math.random() * 45;
      setTimeout(typeNextCharacter, randomDelay);
    } else {
      cursorSpan.remove();
      if (onComplete) onComplete();
    }
  }
  typeNextCharacter();
}

let distinctFloatingElementsTapped = 0;
const tappedFloatingElementIndexes = new Set();

function handleFloatingElementTap(tapEvent, elementIndex) {
  showFloatingElementReactionBubble(tapEvent);
  if (window.confetti) {
    confetti({
      particleCount: 22, spread: 45, startVelocity: 22,
      origin: { x: tapEvent.clientX / window.innerWidth, y: tapEvent.clientY / window.innerHeight }
    });
  }
  if (!tappedFloatingElementIndexes.has(elementIndex)) {
    tappedFloatingElementIndexes.add(elementIndex);
    distinctFloatingElementsTapped++;
    if (distinctFloatingElementsTapped === 3) {
      revealHiddenBonusSparkle();
    }
  }
}

function showFloatingElementReactionBubble(tapEvent) {
  const bubble = document.createElement('div');
  bubble.className = 'floatingElementReactionBubble';
  bubble.textContent = floatingElementReactionMessages[
    Math.floor(Math.random() * floatingElementReactionMessages.length)
  ];
  bubble.style.left = (tapEvent.clientX - 60) + 'px';
  bubble.style.top = (tapEvent.clientY - 50) + 'px';
  document.body.appendChild(bubble);
  setTimeout(function () { bubble.remove(); }, 2400);
}

function revealHiddenBonusSparkle() {
  const bonusSparkle = document.getElementById('hiddenBonusSparkle');
  if (bonusSparkle) bonusSparkle.classList.add('isRevealed');
}

function handleHiddenBonusSparkleTap(tapEvent) {
  if (window.confetti) {
    confetti({ particleCount: 140, spread: 120, origin: { y: 0.4 } });
  }
  const bubble = document.createElement('div');
  bubble.className = 'floatingElementReactionBubble';
  bubble.textContent = "you found it — happy birthday, truly 🤍";
  bubble.style.left = (tapEvent.clientX - 80) + 'px';
  bubble.style.top = (tapEvent.clientY - 60) + 'px';
  document.body.appendChild(bubble);
  setTimeout(function () { bubble.remove(); }, 3000);
}

function seedFloatingDecorativeElements() {
  const finalMessageCard = document.getElementById('finalMessageCard');
  const decorativeEmojiList = ['🤍', '💛', '🌸', '✨', '⭐', '💫', '🌷', '💗'];
  const positions = [
    { top: '-14px', left: '-10px' },
    { top: '-10px', right: '-12px' },
    { top: '22%', left: '-14px' },
    { top: '30%', right: '-14px' },
    { bottom: '-12px', left: '8%' },
    { bottom: '-10px', right: '10%' },
    { top: '55%', left: '-12px' },
    { top: '62%', right: '-12px' }
  ];
  positions.forEach(function (position, index) {
    const element = document.createElement('div');
    element.className = 'floatingDecorativeElement';
    element.textContent = decorativeEmojiList[index % decorativeEmojiList.length];
    Object.assign(element.style, position);
    element.style.animationDelay = (index * 0.35) + 's';
    element.onclick = function (tapEvent) { handleFloatingElementTap(tapEvent, index); };
    finalMessageCard.appendChild(element);
  });

  const bonusSparkle = document.createElement('div');
  bonusSparkle.className = 'hiddenBonusSparkle';
  bonusSparkle.id = 'hiddenBonusSparkle';
  bonusSparkle.textContent = '🎆';
  bonusSparkle.style.top = '50%';
  bonusSparkle.style.right = '-16px';
  bonusSparkle.onclick = handleHiddenBonusSparkleTap;
  finalMessageCard.appendChild(bonusSparkle);
}

function beginFinalMessageSequence() {
  seedFloatingDecorativeElements();
  const messageContainer = document.getElementById('birthdayMessageTextContainer');
  typewriteBirthdayMessage(birthdayMessageText, messageContainer, function () {
    document.getElementById('signatureLine').classList.add('isVisible');
    document.getElementById('replayExperienceButton').classList.add('isVisible');
  });
}

/* ============================================================
   Replay — lets her relive the candle-blow + confetti moment
   without refreshing the page. Resets the cake back to its
   unblown state and swaps the final message card back out.
   ============================================================ */
function handleReplayClick() {
  const messageCard = document.getElementById('finalMessageCard');
  const cakeCard = document.getElementById('birthdayCakeCard');
  const cakeAssembly = document.getElementById('cakeAssembly');
  const replayButton = document.getElementById('replayExperienceButton');

  // clear the previous round's decorative sparkles so beginFinalMessageSequence
  // doesn't stack a second set on top when she blows the candle again
  messageCard.querySelectorAll('.floatingDecorativeElement, #hiddenBonusSparkle').forEach(function (el) {
    el.remove();
  });
  tappedFloatingElementIndexes.clear();
  distinctFloatingElementsTapped = 0;

  replayButton.classList.remove('isVisible');
  messageCard.classList.remove('isVisible');
  document.getElementById('birthdayMessageTextContainer').innerHTML = '';
  document.getElementById('signatureLine').classList.remove('isVisible');

  cakeAssembly.classList.remove('isCandleBlownOut');
  document.getElementById('blowCandleButton').style.display = '';
  cakeCard.style.display = '';
  cakeCard.classList.add('isVisible');
}

/* ============================================================
   Cursor heart trail — tiny hearts drift out from wherever the
   cursor moves, site-wide. Throttled so it stays subtle instead
   of spamming a heart on every pixel of movement.
   ============================================================ */
(function initializeCursorHeartTrail() {
  const heartGlyphs = ['❤️'];
  let lastSpawnTime = 0;
  const minMillisecondsBetweenHearts = 140;

  function spawnTrailHeart(x, y) {
    const heart = document.createElement('span');
    heart.className = 'cursorHeartTrailParticle';
    heart.textContent = heartGlyphs[Math.floor(Math.random() * heartGlyphs.length)];
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.setProperty('--driftX', (Math.random() * 40 - 20) + 'px');
    document.body.appendChild(heart);
    setTimeout(function () { heart.remove(); }, 1100);
  }

  function handlePointerMove(x, y) {
    const now = performance.now();
    if (now - lastSpawnTime < minMillisecondsBetweenHearts) return;
    lastSpawnTime = now;
    spawnTrailHeart(x, y);
  }

  window.addEventListener('mousemove', function (moveEvent) {
    handlePointerMove(moveEvent.clientX, moveEvent.clientY);
  });
  window.addEventListener('touchmove', function (moveEvent) {
    const touch = moveEvent.touches[0];
    if (touch) handlePointerMove(touch.clientX, touch.clientY);
  }, { passive: true });
})();

/* ============================================================
   Falling petals — a sparse, continuous drift of petals across
   every scene, carrying the tulip-bouquet thread through the
   whole site. Kept deliberately sparse and slow.
   ============================================================ */
(function initializeFallingPetals() {
  const petalGlyphs = ['🌸', '🌷', '🌺'];
  const millisecondsBetweenPetals = 2600;

  function spawnFallingPetal() {
    const petal = document.createElement('span');
    petal.className = 'fallingPetal';
    petal.textContent = petalGlyphs[Math.floor(Math.random() * petalGlyphs.length)];
    petal.style.left = (Math.random() * 100) + 'vw';
    petal.style.setProperty('--driftX', (Math.random() * 60 - 30) + 'px');
    petal.style.setProperty('--fallDuration', (9 + Math.random() * 6) + 's');
    petal.style.setProperty('--fallDelay', (Math.random() * 0.6) + 's');
    petal.style.fontSize = (14 + Math.random() * 8) + 'px';
    document.body.appendChild(petal);
    setTimeout(function () { petal.remove(); }, 16000);
  }

  setInterval(spawnFallingPetal, millisecondsBetweenPetals);
  spawnFallingPetal();
})();