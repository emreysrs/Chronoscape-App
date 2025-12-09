# Chronoscape - Zamanda Yolculuk AR Uygulaması

Chronoscape, iOS için geliştirilmiş bir artırılmış gerçeklik (AR) uygulamasıdır. Kameranızı kullanarak geçmiş, şimdi ve gelecek arasında geçiş yaparak zamanı keşfedin.

## Özellikler

- ⏳ **Splash Screen**: Hoş bir açılış ekranı
- 📱 **Onboarding**: Kullanıcı dostu tanıtım ekranları
- 📸 **AR Kamera Görünümü**: Gerçek zamanlı kamera üzerine geçmiş ve gelecek görüntüleri
- 🎨 **Smooth Animasyonlar**: React Native Reanimated ile akıcı geçişler
- 🌐 **Zaman Modları**: Geçmiş, Şimdi ve Gelecek arasında geçiş

## Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn
- iOS için: Xcode ve macOS
- Expo Go uygulaması (geliştirme için)

### Adımlar

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. iOS Simulator'de çalıştırın:
```bash
npm run ios
```

3. Fiziksel cihazda test etmek için Expo Go kullanın:
```bash
npx expo start
```
Sonra Expo Go uygulamasıyla QR kodu tarayın.

## Kullanılan Teknolojiler

- **React Native**: Mobil uygulama framework'ü
- **Expo**: Geliştirme ve deployment platformu
- **React Native Reanimated**: Performanslı animasyonlar
- **Expo Camera**: Kamera erişimi
- **Expo Linear Gradient**: Gradient efektleri
- **Expo Blur**: Blur efektleri
- **TypeScript**: Tip güvenliği

## Proje Yapısı

```
ChronoscapeApp/
├── components/
│   ├── SplashScreen.tsx      # Açılış ekranı
│   ├── OnboardingScreen.tsx  # Tanıtım ekranları
│   └── MainARView.tsx        # Ana AR görünümü
├── App.tsx                   # Ana uygulama bileşeni
├── app.json                  # Expo konfigürasyonu
├── babel.config.js           # Babel konfigürasyonu
└── package.json              # Bağımlılıklar

```

## Kullanım

1. Uygulama açıldığında splash screen görünür
2. Onboarding ekranlarında uygulamanın nasıl kullanılacağı açıklanır
3. Ana ekranda kamera açılır ve üç mod arasında geçiş yapabilirsiniz:
   - 📜 **Geçmiş**: Tarihi görüntüler
   - 📍 **Şimdi**: Normal kamera görünümü
   - 🚀 **Gelecek**: Fütüristik görüntüler

## Kamera İzinleri

Uygulama iOS'ta kamera erişimi için izin ister. İzin verilmezse uygulama tam olarak çalışmaz. İzinleri Ayarlar > Gizlilik > Kamera'dan değiştirebilirsiniz.

## Geliştirme

### Debug Modu
```bash
npx expo start --dev-client
```

### iOS Build
```bash
npx expo build:ios
```

veya EAS Build kullanarak:
```bash
npm install -g eas-cli
eas login
eas build --platform ios
```

## Sorun Giderme

### Kamera çalışmıyor
- Kamera izinlerinin verildiğinden emin olun
- Fiziksel cihazda test edin (simulator kamera desteği sınırlıdır)

### Animasyonlar yavaş
- React Native Reanimated'in doğru kurulduğundan emin olun
- Babel config'in güncel olduğunu kontrol edin

### Build hataları
```bash
# Cache'i temizle
npx expo start -c

# Node modules'ü yeniden yükle
rm -rf node_modules
npm install
```

## Lisans

MIT

## İletişim

Sorularınız için GitHub issues bölümünü kullanabilirsiniz.
