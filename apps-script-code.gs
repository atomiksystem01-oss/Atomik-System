// Paste this into script.google.com (new project) as Code.gs, then deploy:
// Deploy > New deployment > type: Web app
//   Execute as: Me
//   Who has access: Anyone
// Copy the resulting /exec URL and send it back — it goes into thank-you.html
// as APPS_SCRIPT_URL.

var NOTIFY_TO = 'atomiksystem01@gmail.com';

var VIDEO_BUNDLE_URL = 'https://drive.google.com/drive/folders/1wgUm0Jf2M52-FLd83yjN2pjjV4WEFDEf';
var ULTIMATE_ASSET_URL = 'https://drive.google.com/drive/folders/1a3whNClw2gZii3gGwjPRkpqFRuzcbbAs';

function doPost(e) {
  var email = ((e.parameter && e.parameter.email) || '').trim().toLowerCase();

  if (!email || email.indexOf('@') === -1) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'invalid email' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var props = PropertiesService.getScriptProperties();
  var existing = props.getProperty('CLAIMED_EMAILS') || '';
  var list = existing ? existing.split(',').map(function(s){ return s.trim(); }).filter(Boolean) : [];

  var isNew = list.indexOf(email) === -1;
  if (isNew) list.push(email);
  var joined = list.join(', ');
  props.setProperty('CLAIMED_EMAILS', joined);

  MailApp.sendEmail({
    to: NOTIFY_TO,
    subject: (isNew ? 'New vault claim: ' : 'Repeat vault visit: ') + email,
    body:
      'Email entered on the thank-you page: ' + email + '\n' +
      (isNew ? '(new — added to the list)\n' : '(already on the list — link may have been shared)\n') +
      '\nTotal unique claims: ' + list.length +
      '\n\nAll claimed emails so far:\n' + joined
  });

  MailApp.sendEmail({
    to: email,
    subject: 'Your Editor\'s Vault access',
    body:
      'Hey,\n\n' +
      'Thanks for grabbing the bundle — here are your two folders:\n\n' +
      'Video Editing Bundle\n' + VIDEO_BUNDLE_URL + '\n\n' +
      'Ultimate Asset Folder\n' + ULTIMATE_ASSET_URL + '\n\n' +
      'Just click "Add shortcut to Drive" (or request access if it asks) and everything\'s yours to keep — download the whole thing or just the packs you need.\n\n' +
      'If a link doesn\'t open or anything looks off, just reply to this email and I\'ll sort it out personally.\n\n' +
      'Enjoy the bundle.\n' +
      'The Editor\'s Vault'
  });

  return ContentService.createTextOutput(JSON.stringify({ ok: true, isNew: isNew }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Hitting the /exec URL with a GET (e.g. from a free cron pinger) just confirms it's alive.
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, status: 'alive' }))
    .setMimeType(ContentService.MimeType.JSON);
}
