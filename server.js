const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const os = require('os');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('🔹 İstek içeriği:', req.body);
  }
  next();
});

try {
  const serviceAccount = require('./firebaseServiceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (err) {
  console.error('Firebase Admin başlatılamadı:', err);
  process.exit(1);
}

const db = admin.firestore();

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Bildirim sunucusu çalışıyor 🚀',
    timestamp: new Date().toISOString(),
    serverInfo: {
      platform: os.platform(),
      hostname: os.hostname(),
    },
  });
});

app.post('/send-notification', async (req, res) => {
  const { title, body, topic } = req.body;

  if (!title || !body || !topic) {
    return res.status(400).json({
      error: 'Gerekli alanlar eksik',
      required: ['title', 'body', 'topic'],
      received: { title: !!title, body: !!body, topic: !!topic },
    });
  }

  const message = {
    notification: { title, body },
    topic,
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        channelId: 'default_channel_id',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);

    await db.collection('notifications').add({
      title,
      body,
      topic,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      messageId: response,
      status: 'sent',
    });

    return res.status(200).json({
      success: true,
      messageId: response,
      message: 'Bildirim başarıyla gönderildi',
    });
  } catch (err) {
    console.error('Bildirim gönderilirken hata oluştu:', err);
    return res.status(500).json({
      success: false,
      error: 'Bildirim gönderilemedi',
      details: err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sunucu başlatıldı: http://localhost:${PORT}`);
});
