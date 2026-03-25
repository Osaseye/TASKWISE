const fs = require('fs');

const path = 'c:/Users/User/OneDrive/Desktop/TASKWISE/TASKWISE/Taskwise/src/components/dashboard/AIAssistantSidebar.jsx';
let content = fs.readFileSync(path, 'utf8');

const regex1 = /<button\s+className="flex items-center gap-2 px-4 py-2[^>]*>\s*<span\s+className="material-symbols-outlined text-\[18px\]">calendar_today<\/span>\s*Plan my day\s*<\/button>/g;
content = content.replace(regex1, match => `<button onClick={() => setInputValue('Plan my day')} ${match.substring(8)}`);

const regex2 = /<button\s+className="flex items-center gap-2 px-4 py-2[^>]*>\s*<span\s+className="material-symbols-outlined text-\[18px\]">school<\/span>\s*Study plan\s*<\/button>/g;
content = content.replace(regex2, match => `<button onClick={() => setInputValue('Create a study plan for me')} ${match.substring(8)}`);

const regex3 = /<button\s+className="flex items-center gap-2 px-4 py-2[^>]*>\s*<span\s+className="material-symbols-outlined text-\[18px\]">lightbulb<\/span>\s*Brainstorm\s*<\/button>/g;
content = content.replace(regex3, match => `<button onClick={() => setInputValue('Help me brainstorm ideas')} ${match.substring(8)}`);

fs.writeFileSync(path, content, 'utf8');
console.log('Done fixing chips');