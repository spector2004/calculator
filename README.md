# Advanced Calculator

A modern, feature-rich calculator web app with beautiful UI, animations, sound effects, and advanced functionality.

## ✨ Features

### 🧮 **Core Calculator Functions**
- Basic operations: add, subtract, multiply, divide
- Chaining operations and equals
- Percent calculations
- Toggle sign (±)
- Decimal point input
- Delete (backspace) and All Clear
- Precision handling and scientific notation fallback

### 🎨 **Visual Design**
- **Modern gradient UI** with glassmorphism effects
- **Light/Dark theme toggle** with persistent preferences
- **Smooth animations** and transitions
- **Enhanced shadows and depth** for premium look
- **Responsive design** for all screen sizes
- **Professional typography** with improved spacing

### 🔊 **Audio Feedback**
- **Unique sound effects** for different button types
- **Different frequencies** for digits (800-1250Hz based on number)
- **Audio feedback** for all operations and functions
- **Web Audio API** implementation for crisp sounds

### 📋 **History System**
- **Calculation history** - stores up to 50 previous calculations
- **Clickable history items** - click any result to use it again
- **Smooth slide-in animation** when toggling history
- **Clear history** button to reset
- **Persistent history** during session

### ⌨️ **Keyboard Support**
- **Full keyboard navigation**: 0-9, ., +, -, *, /, %, Enter/=, Backspace, Escape
- **Accessible controls** with proper ARIA labels
- **Focus management** and visual indicators

### 🎯 **Interactive Features**
- **Visual button feedback** - buttons animate when pressed
- **Enhanced hover effects** with gradient overlays
- **Theme persistence** - remembers your preference
- **Error handling** with user-friendly messages

## 🚀 Usage

1. **Open** `index.html` in your browser
2. **Click buttons** or use keyboard shortcuts
3. **Toggle theme** using the 🌙/☀️ button in the header
4. **View history** using the 📋 button to see previous calculations
5. **Click history items** to reuse previous results

## 🎮 Controls

### Mouse/Touch
- Click any button to perform operations
- Click history items to reuse results
- Use theme toggle (🌙/☀️) to switch between light/dark modes
- Use history toggle (📋) to show/hide calculation history

### Keyboard
- **Digits**: `0-9` - Input numbers
- **Operations**: `+`, `-`, `*`, `/` - Mathematical operations
- **Functions**: 
  - `.` - Decimal point
  - `%` - Percent
  - `Enter` or `=` - Equals
  - `Backspace` - Delete last character
  - `Escape` - All Clear

## 🛠️ Technical Details

- **Pure JavaScript** - No external dependencies
- **CSS Grid** for responsive layout
- **Web Audio API** for sound effects
- **Local Storage** for theme persistence
- **Accessibility** compliant with ARIA labels
- **Modern CSS** with gradients, animations, and transitions

## 📱 Browser Support

- Chrome/Edge (recommended for best audio experience)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Customization

The calculator uses CSS custom properties and can be easily customized by modifying the color schemes in `styles.css`. Both light and dark themes are fully implemented with consistent styling.

## 📝 Notes

- Division by zero results in `Error` - press AC to reset
- Very large/small numbers automatically switch to scientific notation
- History is stored in memory and clears when page is refreshed
- Sound effects require user interaction to enable (browser security)


