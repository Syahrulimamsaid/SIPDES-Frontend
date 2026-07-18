import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import Button from "../../../components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TablePagination } from "../../../components/ui/table"
import { User } from "../../../interface/UserInterface";
import AddUserModal from "./Add";
import EditUserModal from "./Edit";
import DeleteUserModal from "./Delete";
import ResetDeviceModal from "./ResetDevice";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  UserCheck,
  Phone,
  Building,
  Smartphone,
} from "lucide-react";
import { catchHandle } from "../../../helpers/catchHandle";
import UserController from "../../../controller/UserController";

export default function UserManagement() {
  const userController = new UserController();

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const getUser = async () => {
    try {
      const data = await userController.get();
      setUsers(data);
    } catch (e) {
      catchHandle({ err: e, variant: "error" });
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const q = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.fullname.toLowerCase().includes(q) ||
            u.phone_number.includes(q) ||
            (u.village?.name || "").toLowerCase().includes(q)
        )
      );
    }
  }, [users, searchTerm]);

  const handleAddClick = () => {
    setIsAddOpen(true);
  };

  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setCurrentUser(user);
    setIsDeleteOpen(true);
  };

  const handleResetClick = (user: User) => {
    setCurrentUser(user);
    setIsResetOpen(true);
  };

  return (
    <>
      <PageMeta
        title="Manajemen User - SIPDES"
        description="Kelola data perangkat desa dan operator sistem"
      />
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Manajemen User
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kelola data akun perangkat desa (User) dan administrator (Operator).
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 self-start sm:self-auto"
            startIcon={<Plus size={18} />}
          >
            Tambah User Baru
          </Button>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="max-w-md space-y-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Cari Berdasarkan Nama / No HP / Desa
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
              <input
                type="text"
                placeholder="Ketik untuk mencari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                <TableRow>
                  <TableCell isHeader className="px-6 py-4">Nama Lengkap</TableCell>
                  <TableCell isHeader className="px-6 py-4">Nomor HP</TableCell>
                  <TableCell isHeader className="px-6 py-4">Desa</TableCell>
                  <TableCell isHeader className="px-6 py-4">Role</TableCell>
                  <TableCell isHeader className="px-6 py-4 text-center">Aksi</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                    >
                      <TableCell className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {user.fullname}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="flex items-center gap-1.5">
                          <Phone size={14} className="text-gray-400" />
                          {user.phone_number}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {user.village?.name ? (
                          <span className="flex items-center gap-1.5">
                            <Building size={14} className="text-gray-400" />
                            {user.village.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">-</span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${user.role === "admin"
                            ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                            : user.role === "operator"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                            }`}
                        >
                          <UserCheck size={12} /> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {user.role == 'umum' ?
                            <button
                              onClick={() => handleResetClick(user)}
                              className="p-1.5 rounded-lg text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:text-orange-300 dark:hover:bg-orange-500/10 transition-colors"
                              title="Reset Device"
                            >
                              <Smartphone size={16} />
                            </button>
                            : ''}

                          <button
                            onClick={() => handleEditClick(user)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-brand-500/10 transition-colors"
                            title="Edit User"
                          >
                            <Edit2 size={16} />
                          </button>

                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                            title="Hapus User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="px-6 py-12 text-center text-gray-400 dark:text-gray-600">
                      Tidak ada user terdaftar yang sesuai.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {users.length > 0 && (
            <TablePagination
              data={users}
              defaultItemsPerPage={10}
              onPageDataChange={setFilteredUsers}
            />
          )}
        </div>

        <AddUserModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSuccess={getUser}
        />

        <EditUserModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          user={currentUser}
          onSuccess={getUser}
        />

        <DeleteUserModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          user={currentUser}
          onSuccess={getUser}
        />

        <ResetDeviceModal
          isOpen={isResetOpen}
          onClose={() => setIsResetOpen(false)}
          user={currentUser}
          onSuccess={getUser}
        />
      </div>
    </>
  );
}
