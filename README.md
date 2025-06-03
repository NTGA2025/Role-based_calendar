# Offline Calendar App

A fully-featured HTML5 calendar application inspired by iOS Calendar, with complete offline functionality and role-based event management.

## Features

### Core Features

1. **Offline Functionality**
   - Works entirely offline with no network connection required
   - Uses Service Workers and local storage for data persistence
   - Progressive Web App (PWA) support for installation on devices

2. **Role-Based Event Management**
   - Create and manage custom roles (e.g., Work, Personal, Family)
   - Assign roles to calendar events
   - Filter calendar view by role
   - Color-code events based on their associated role

### Additional Features

- Multiple calendar views: Day, Week, Month, and Year
- Create, edit, and delete events
- Event details including title, start/end times, location, and notes
- Responsive design that works on mobile and desktop

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/offline-calendar.git
   ```

2. Navigate to the project directory:
   ```
   cd offline-calendar
   ```

3. Serve the files using a local web server. For example, using Python:
   ```
   python -m http.server 8000
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Using the App

1. **Navigate the Calendar**
   - Use the view buttons (Day, Week, Month, Year) to switch between views
   - Use the arrow buttons to navigate between time periods
   - Click "Today" to return to the current date

2. **Create Events**
   - Click the "+" button or click on a day/time slot
   - Fill in the event details
   - Optionally assign a role to the event
   - Click "Save"

3. **Manage Roles**
   - Click "Manage Roles" button
   - Add new roles with custom names and colors
   - Delete existing roles
   - Filter events by selecting a role from the dropdown

## Technical Details

- Built with vanilla JavaScript, HTML5, and CSS3
- Uses the localStorage API for data persistence
- Implements Service Workers for offline functionality
- Follows PWA standards for installability

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## 在iOS上使用本应用

该日历应用是一个渐进式Web应用(PWA)，可以在iOS设备上像原生应用一样使用：

1. 在Safari浏览器中打开应用网址
2. 点击分享按钮（底部工具栏中的方框加上箭头图标）
3. 滚动并点击"添加到主屏幕"
4. 点击"添加"

完成后，应用图标将出现在您的主屏幕上，您可以像使用原生应用一样使用它，包括离线访问功能。

## 分发应用

如果您想分享这个应用，可以使用项目根目录下的`calendar-app.zip`文件，它包含了应用的所有必要文件。

## 打包应用

### 生成应用图标

1. 访问 http://localhost:8000/icons/generate_icon.html
2. 页面会自动生成两种尺寸的日历图标
3. 点击"下载小图标"和"下载大图标"分别保存192x192和512x512尺寸的图标
4. 将下载的图标文件放入项目的`icons`文件夹中

### 创建ZIP包

```bash
cd /path/to/calendar-app
zip -r calendar-app.zip * -x "*.DS_Store" -x "*.git*"
```

### 部署为网站

您可以将整个项目文件夹上传到任何Web服务器（如GitHub Pages、Netlify或Vercel）来部署这个PWA。

### 创建iOS应用（需要Mac和Xcode）

如果您希望将此PWA转换为真正的iOS应用（IPA文件），您需要：

1. 安装Node.js和npm
2. 安装Cordova: `npm install -g cordova`
3. 创建Cordova项目: `cordova create CalendarApp`
4. 进入项目: `cd CalendarApp`
5. 添加iOS平台: `cordova platform add ios`
6. 将PWA文件复制到www文件夹
7. 使用Xcode打开项目并构建IPA文件

注意：创建IPA文件需要有效的Apple开发者账号。 