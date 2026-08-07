import { User } from "@/types/ui/user.types";


export const UserCard: React.FC<{
  user: User;
  socket: any;
  onSelect: (user: User) => void;
}> = ({ user, socket, onSelect }) => {

  return (
    <div
      onClick={() => onSelect(user)}
      className="flex items-center gap-3 p-2 border-b hover:bg-gray-50 cursor-pointer"
    >
      <img
        src={user.avatar || ""}
        alt={user.firstName}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <h2 className="font-semibold">{`${user.firstName} ${user.lastName}`}</h2>
        <p className="text-sm text-gray-600 truncate">
            {new Date(user.lastActivaty).toLocaleString("en",{hour : "2-digit",minute  : "2-digit"})}
        </p>
      </div>
    </div>
  );
};
