const fs = require('fs');

const path = 'c:/Users/User/OneDrive/Desktop/TASKWISE/TASKWISE/Taskwise/src/components/dashboard/TaskDetailsModal.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'const TaskDetailsModal = ({ isOpen, onClose, task }) => {',
  'const TaskDetailsModal = ({ isOpen, onClose, task, onEdit }) => {'
);

content = content.replace(
  'const { tasks } = useTasks();',
  'const { tasks, toggleTask } = useTasks();'
);

content = content.replace(
  '<button className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[#293738] text-white hover:bg-[#3d5152] transition-colors flex items-center justify-center gap-2">',
  '<button onClick={() => { onClose(); if (onEdit) onEdit(task); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[#293738] text-white hover:bg-[#3d5152] transition-colors flex items-center justify-center gap-2">'
);

content = content.replace(
  '<button\n                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 ${',
  '<button onClick={() => { toggleTask(task.id); onClose(); }}\n                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 ${'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done fixing TaskDetailsModal');