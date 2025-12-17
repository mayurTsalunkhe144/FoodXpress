import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { path: '/user/orders', label: 'Previous Orders', icon: '📦' },
    { path: '/user/edit', label: 'Edit Profile', icon: '👤' },
    { path: '/user/addresses', label: 'Address', icon: '📍' },
    { path: '/user/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="w-80 bg-white h-full shadow-lg">
      <nav className="p-4">
        {menuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive 
                ? 'btn-primary flex items-center gap-3 mb-2 font-outfit bg-red-500 text-white border-red-500 w-full justify-start px-8 py-6 no-underline'
                : 'btn-secondary flex items-center gap-3 mb-2 font-outfit hover:bg-red-500 hover:text-white w-full justify-start px-8 py-6 no-underline'
            }
            replace
          >
            <span className="text-xl w-6 text-center">{item.icon}</span>
            <span className="font-medium text-base">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;