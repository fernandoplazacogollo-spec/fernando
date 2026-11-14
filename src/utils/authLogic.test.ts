import assert from 'node:assert/strict';
import test from 'node:test';
import {
  authenticateAccount,
  ensureSeedAccounts,
  FERNANDO_EMAIL,
  getDefaultPageForAccount,
  getSeedAccounts,
  loginOrCreateGoogleAccount,
  registerAccount,
  resetAccountPassword,
} from './authLogic.ts';
import {
  buildCustomVideoEntry,
  extractYouTubeId,
  FREE_FIRE_VIDEOS,
  filterFreeFireVideos,
} from './freeFireVideos.ts';

test('authenticateAccount accepts seeded admin and Fernando accounts and rejects bad credentials', () => {
  const accounts = getSeedAccounts();

  const okAdmin = authenticateAccount(accounts, 'ADMIN@humanpro.com ', '123456');
  assert.equal(okAdmin.ok, true);
  assert.equal(okAdmin.account?.correo, 'admin@humanpro.com');

  const okFernando = authenticateAccount(
    accounts,
    'FernandoPlazaCogollo@gmail.com',
    'Fernando 1930'
  );
  assert.equal(okFernando.ok, true);
  assert.equal(okFernando.account?.correo, FERNANDO_EMAIL);
  assert.equal(getDefaultPageForAccount(okFernando.account), 'freefire');
  assert.equal(getDefaultPageForAccount(okAdmin.account), 'dashboard');

  const wrongPass = authenticateAccount(accounts, 'admin@humanpro.com', 'wrong');
  assert.equal(wrongPass.ok, false);

  const missingUser = authenticateAccount(accounts, 'nadie@humanpro.com', '123456');
  assert.equal(missingUser.ok, false);
});

test('ensureSeedAccounts merges Fernando account and preserves password across prior Google-only entries', () => {
  const legacyAccounts = [
    {
      id: 'acc-google-old',
      nombre: 'Fernando',
      apellido: 'Plaza',
      correo: FERNANDO_EMAIL,
      cargo: 'Cuenta Google',
      passwordHash: 'hp$oldrandom',
      createdAt: '2026-11-14',
      provider: 'Google' as const,
    },
  ];

  const merged = ensureSeedAccounts(legacyAccounts);
  assert.equal(authenticateAccount(merged, FERNANDO_EMAIL, 'Fernando 1930').ok, true);
  assert.equal(authenticateAccount(merged, 'admin@humanpro.com', '123456').ok, true);
});

test('registerAccount validates fields, prevents duplicate emails, and authenticates new user', () => {
  const seed = getSeedAccounts();

  const invalid = registerAccount(seed, {
    nombre: '',
    apellido: 'Plaza',
    correo: 'correo-malo',
    cargo: 'Gerente',
    password: '123',
    confirmPassword: '456',
  });
  assert.equal(invalid.ok, false);
  assert.ok(invalid.errors?.nombre);
  assert.ok(invalid.errors?.correo);
  assert.ok(invalid.errors?.password);
  assert.ok(invalid.errors?.confirmPassword);

  const duplicate = registerAccount(seed, {
    nombre: 'Admin',
    apellido: 'Dos',
    correo: 'admin@humanpro.com',
    cargo: 'RRHH',
    password: 'password123',
    confirmPassword: 'password123',
  });
  assert.equal(duplicate.ok, false);
  assert.ok(duplicate.errors?.correo);

  const created = registerAccount(seed, {
    nombre: 'Camila',
    apellido: 'Ríos',
    correo: 'Camila@Empresa.com',
    cargo: 'Director General',
    password: 'miPassword99',
    confirmPassword: 'miPassword99',
  });
  assert.equal(created.ok, true);
  assert.equal(created.created?.correo, 'camila@empresa.com');

  const loginRes = authenticateAccount(
    created.accounts,
    'camila@empresa.com',
    'miPassword99'
  );
  assert.equal(loginRes.ok, true);
  assert.equal(loginRes.account?.nombre, 'Camila');
});

test('loginOrCreateGoogleAccount signs in existing or creates new Google user cleanly', () => {
  const seed = getSeedAccounts();

  const invalid = loginOrCreateGoogleAccount(seed, {
    nombre: 'Usuario',
    correo: 'correo-invalido',
  });
  assert.equal(invalid.ok, false);

  const newGoogle = loginOrCreateGoogleAccount(seed, {
    nombre: 'Sofía Méndez',
    correo: 'sofiamendez@gmail.com',
  });
  assert.equal(newGoogle.ok, true);
  assert.equal(newGoogle.account?.provider, 'Google');
  assert.equal(newGoogle.account?.nombre, 'Sofía');
  assert.equal(newGoogle.account?.apellido, 'Méndez');

  const existingGoogle = loginOrCreateGoogleAccount(newGoogle.accounts, {
    nombre: 'Fernando Plaza',
    correo: FERNANDO_EMAIL,
  });
  assert.equal(existingGoogle.ok, true);
  assert.equal(existingGoogle.account?.provider, 'Google');
  assert.equal(
    authenticateAccount(existingGoogle.accounts, FERNANDO_EMAIL, 'Fernando 1930').ok,
    true
  );
});

test('resetAccountPassword updates password hash cleanly', () => {
  const seed = getSeedAccounts();
  const created = registerAccount(seed, {
    nombre: 'Lucía',
    apellido: 'Gómez',
    correo: 'lucia@humanpro.com',
    cargo: 'Analista',
    password: 'oldPassword1',
    confirmPassword: 'oldPassword1',
  });

  const resetRes = resetAccountPassword(created.accounts, 'lucia@humanpro.com', 'newPassword2');
  assert.equal(resetRes.ok, true);

  assert.equal(
    authenticateAccount(resetRes.accounts, 'lucia@humanpro.com', 'oldPassword1').ok,
    false
  );
  assert.equal(
    authenticateAccount(resetRes.accounts, 'lucia@humanpro.com', 'newPassword2').ok,
    true
  );
});

test('filterFreeFireVideos filters accurately by creator and search query', () => {
  assert.equal(FREE_FIRE_VIDEOS.length, 8);
  const donato = filterFreeFireVideos(FREE_FIRE_VIDEOS, 'TheDonato', '');
  const ronaldo = filterFreeFireVideos(FREE_FIRE_VIDEOS, 'Ronaldo 777', '');
  assert.equal(donato.length, 4);
  assert.equal(ronaldo.length, 4);

  const awm = filterFreeFireVideos(FREE_FIRE_VIDEOS, 'Todos', 'awm');
  assert.equal(awm.length, 1);
  assert.equal(awm[0].creator, 'TheDonato');

  const todoRojo = filterFreeFireVideos(FREE_FIRE_VIDEOS, 'Ronaldo 777', 'todo rojo');
  assert.equal(todoRojo.length, 2);
});

test('extractYouTubeId and buildCustomVideoEntry handle YouTube URLs and direct MP4 URLs', () => {
  assert.equal(
    extractYouTubeId('https://www.youtube.com/watch?v=9bno27_w9Jg'),
    '9bno27_w9Jg'
  );
  assert.equal(extractYouTubeId('https://youtu.be/Vu6Pg9Oveuc?t=10'), 'Vu6Pg9Oveuc');
  assert.equal(
    extractYouTubeId('https://www.youtube.com/shorts/1O7Xjs3DJT0'),
    '1O7Xjs3DJT0'
  );
  assert.equal(extractYouTubeId('not-a-url'), null);

  const ytRes = buildCustomVideoEntry({
    url: 'https://youtu.be/bM2m_8CldwA',
    title: 'Gran Maestro Donato',
    creator: 'TheDonato',
  });
  assert.equal(ytRes.ok, true);
  assert.equal(ytRes.video?.sourceType, 'youtube');
  assert.equal(ytRes.video?.youtubeId, 'bM2m_8CldwA');

  const mp4Res = buildCustomVideoEntry({
    url: 'https://cdn.example.com/clip.mp4',
    title: 'Mi jugada',
  });
  assert.equal(mp4Res.ok, true);
  assert.equal(mp4Res.video?.sourceType, 'video');

  assert.equal(buildCustomVideoEntry({ url: '' }).ok, false);
});

test('getYouTubeEmbedUrl enables JS audio API unmuted by default and buildYouTubePlayerCommand formats sound commands', async () => {
  const { getYouTubeEmbedUrl, buildYouTubePlayerCommand } = await import(
    './freeFireVideos.ts'
  );

  const defaultUrl = getYouTubeEmbedUrl('9bno27_w9Jg', {
    autoplay: true,
    muted: false,
    origin: 'http://localhost:3000',
  });
  assert.ok(defaultUrl.includes('enablejsapi=1'));
  assert.ok(defaultUrl.includes('mute=0'));
  assert.ok(defaultUrl.includes('autoplay=1'));

  const legacyCallUrl = getYouTubeEmbedUrl('9bno27_w9Jg', true);
  assert.ok(legacyCallUrl.includes('mute=0'));
  assert.ok(legacyCallUrl.includes('autoplay=1'));

  assert.equal(
    buildYouTubePlayerCommand('unMute'),
    '{"event":"command","func":"unMute","args":[]}'
  );
  assert.equal(
    buildYouTubePlayerCommand('setVolume', [100]),
    '{"event":"command","func":"setVolume","args":[100]}'
  );
});
