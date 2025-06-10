import { View, Text, StyleSheet, Image, TouchableOpacity, ImageSourcePropType } from "react-native";
import { Bell } from "lucide-react-native"; // ou use ícones de outra lib

interface HeaderUsuarioProps {
    name: string | undefined,
    imagem: ImageSourcePropType | undefined
}

export const HeaderUsuario = ({name, imagem}: HeaderUsuarioProps) => {
  return (
    <View style={styles.container}>
      {/* Nome do usuário */}
      <View>
        <Text style={styles.role}>Handyman</Text>
        <Text style={styles.name}>{name}</Text>
      </View>

      {/* Ícones e avatar */}
      <View style={styles.actions}>
        <TouchableOpacity>
          <Bell size={20} color="#a64b00" />
        </TouchableOpacity>
        <Image
          source={imagem}
          style={styles.avatar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fbe6d4",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius:20,
    padding: 16,
    marginBottom:20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  role: {
    fontSize: 14,
    color: "#a64b00",
    fontWeight: "600",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#a64b00",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 16,
  },
});
