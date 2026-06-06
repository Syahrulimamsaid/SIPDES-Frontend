import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { Modal } from "../../../components/ui/modal";
import {
  getDbUsers,
  saveDbUsers,
  getDbVillages,
} from "../../../helpers/adminDb";
import { User } from "../../../interface/UserInterface";
import { Village } from "../../../interface/VillageInterface";
import toast from "react-hot-toast";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  UserCheck,
  Shield,
  Phone,
  Building,
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // CRUD Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Form states
  const [formFullname, setFormFullname] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState("umum");
  const [formVillageId, setFormVillageId] = useState("");
  const [formPassword, setFormPassword] = useState("");

  // Options for Role select
  const roleOptions = [
    { value: "umum", label: "Umum (Perangkat Desa)" },
    { value: "operator", label: "Operator (Administrator)" },
  ];

  // Options for Village select
  const villageOptions = villages.map((v) => ({
    value: v.id,
    label: v.name,
  }));

  const loadData = () => {
    setUsers(getDbUsers());
    setVillages(getDbVillages());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter users by search term
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

  const resetForm = () => {
    setFormFullname("");
    setFormPhone("");
    setFormRole("umum");
    setFormVillageId("");
    setFormPassword("");
    setCurrentUser(null);
  };

  const handleAddClick = () => {
    resetForm();
    if (villages.length > 0) {
      setFormVillageId(villages[0].id);
    }
    setIsAddOpen(true);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (formFullname.trim() === "" || formPhone.trim() === "") {
      toast.error("Nama lengkap dan nomor HP wajib diisi!");
      return;
    }

    // Check duplicate phone
    if (users.some((u) => u.phone_number === formPhone)) {
      toast.error("Nomor HP sudah terdaftar!");
      return;
    }

    const newUser: User = {
      id: "U" + Date.now(),
      fullname: formFullname,
      phone_number: formPhone,
      role: formRole,
      villageId: formVillageId,
      password: formPassword || "123456", // default password
    };

    const updated = [...users, newUser];
    saveDbUsers(updated);
    toast.success("User berhasil ditambahkan!");
    loadData();
    setIsAddOpen(false);
    resetForm();
  };

  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    setFormFullname(user.fullname);
    setFormPhone(user.phone_number);
    setFormRole(user.role);
    setFormVillageId(user.villageId || "");
    setFormPassword(""); // leave password empty to not update
    setIsEditOpen(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (formFullname.trim() === "" || formPhone.trim() === "") {
      toast.error("Nama lengkap dan nomor HP wajib diisi!");
      return;
    }

    // Check duplicate phone (excluding current user)
    if (users.some((u) => u.phone_number === formPhone && u.id !== currentUser.id)) {
      toast.error("Nomor HP sudah terdaftar!");
      return;
    }

    const updated = users.map((u) => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          fullname: formFullname,
          phone_number: formPhone,
          role: formRole,
          villageId: formVillageId,
          ...(formPassword ? { password: formPassword } : {}), // only update password if filled
        };
      }
      return u;
    });

    saveDbUsers(updated);
    toast.success("Data user berhasil diperbarui!");
    loadData();
    setIsEditOpen(false);
    resetForm();
  };

  const handleDeleteClick = (user: User) => {
    setCurrentUser(user);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!currentUser) return;

    const updated = users.filter((u) => u.id !== currentUser.id);
    saveDbUsers(updated);
    toast.success("User berhasil dihapus!");
    loadData();
    setIsDeleteOpen(false);
    resetForm();
  };

  return (
    <>
      <PageMeta
        title="Manajemen User - SIPDES"
        description="Kelola data perangkat desa dan operator sistem"
      />
      <div className="space-y-6">
        {/* Header */}
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

        {/* Toolbar */}
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

        {/* Users Table */}
        <div className="rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                <tr>
                  <th className="px-6 py-4">Nama Lengkap</th>
                  <th className="px-6 py-4">Nomor HP</th>
                  <th className="px-6 py-4">Desa Wilayah</th>
                  <th className="px-6 py-4">Role Sistem</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {user.fullname}
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5">
                          <Phone size={14} className="text-gray-400" />
                          {user.phone_number}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.village?.name ? (
                          <span className="flex items-center gap-1.5">
                            <Building size={14} className="text-gray-400" />
                            {user.village.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                            user.role === "operator"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                          }`}
                        >
                          {user.role === "operator" ? (
                            <>
                              <Shield size={12} /> Operator
                            </>
                          ) : (
                            <>
                              <UserCheck size={12} /> Umum
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
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
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 dark:text-gray-600">
                      Tidak ada user terdaftar yang sesuai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah User */}
        <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} className="max-w-md p-6 sm:p-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              Tambah User Baru
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Fullname */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Nama Lengkap
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: Andi Wijaya"
                  value={formFullname}
                  onChange={(e) => setFormFullname(e.target.value)}
                  required
                />
              </div>

              {/* Phone number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Nomor HP
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  required
                />
              </div>

              {/* Village select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Desa Penugasan
                </label>
                <Select
                  options={villageOptions}
                  placeholder="Pilih Desa"
                  onChange={(val) => setFormVillageId(val)}
                  defaultValue={formVillageId}
                />
              </div>

              {/* Role select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Role Sistem
                </label>
                <Select
                  options={roleOptions}
                  placeholder="Pilih Role"
                  onChange={(val) => setFormRole(val)}
                  defaultValue={formRole}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Password Akun
                </label>
                <Input
                  type="password"
                  placeholder="Kosongkan untuk default '123456'"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary">
                  Simpan User
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Modal Edit User */}
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} className="max-w-md p-6 sm:p-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              Ubah Data User
            </h3>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              {/* Fullname */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Nama Lengkap
                </label>
                <Input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={formFullname}
                  onChange={(e) => setFormFullname(e.target.value)}
                  required
                />
              </div>

              {/* Phone number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Nomor HP
                </label>
                <Input
                  type="text"
                  placeholder="Nomor HP"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  required
                />
              </div>

              {/* Village select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Desa Penugasan
                </label>
                <Select
                  options={villageOptions}
                  placeholder="Pilih Desa"
                  onChange={(val) => setFormVillageId(val)}
                  defaultValue={formVillageId}
                />
              </div>

              {/* Role select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Role Sistem
                </label>
                <Select
                  options={roleOptions}
                  placeholder="Pilih Role"
                  onChange={(val) => setFormRole(val)}
                  defaultValue={formRole}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Ubah Password Akun
                </label>
                <Input
                  type="password"
                  placeholder="Masukkan password baru untuk merubah"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary">
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Modal Delete Confirmation */}
        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} className="max-w-sm p-6">
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Hapus User?
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Apakah Anda yakin ingin menghapus user{" "}
                <span className="font-semibold text-gray-800 dark:text-white">
                  {currentUser?.fullname}
                </span>
                ? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDeleteOpen(false)}>
                Batal
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 border-none"
                onClick={handleConfirmDelete}
              >
                Hapus
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
