import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList, Pressable } from "react-native";
import { ThemedButton } from "../ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome6 } from "@expo/vector-icons";
import ThemedTextInput from "../ThemedTextInput";
import { ThemedText } from "@/components/ThemedText";
import { addPlayers } from "@/features/slices/playersSlice";
import ThemedModal from "../ThemedModal";
import * as Contacts from "expo-contacts";

const ContactRow = ({ contact, isSelected, handleSelected, disabled }) => {
  //const [selected, setSelected] = useState(false);
  const { id, name, avatar } = contact;

  const iconColor = useThemeColor({}, "buttonBackground");
  const iconBackground = useThemeColor({}, "buttonText");

  return (
    <Pressable onPress={handleSelected} disabled={disabled}>
      <View
        key={id}
        style={{
          flexDirection: "row",
          gap: 20,
          alignItems: "center",
          paddingVertical: 5,
          paddingHorizontal: 10,
          opacity: disabled ? 0.5 : 1,
          backgroundColor: isSelected || disabled ? iconColor : "transparent",
          borderRadius: 10,
          marginVertical: 5,
        }}
      >
        <View
          style={{
            borderRadius: 30,
            width: 50,
            height: 50,
            borderWidth: 2,
            borderColor: "white",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              isSelected || disabled ? iconBackground : "transparent",
          }}
        >
          {isSelected || disabled ? (
            <FontAwesome6 name="check" size={20} color={iconColor} />
          ) : (
            <Avatar name={name} size={50} source={avatar} />
          )}
        </View>
        <ThemedText style={{color: isSelected || disabled ? iconBackground : iconColor}} type="h3">{name}</ThemedText>
      </View>
    </Pressable>
  );
};

export default AddContactFormModal = ({ handleClose, ...rest }) => {
  const [usersContacts, setUsersContacts] = useState([]);

  const [filterText, setFilterText] = useState("");

  const filteredContacts = useMemo(
    () =>
      filterText.length > 2
        ? usersContacts.filter(({ name }) => name?.includes(filterText))
        : usersContacts,
    [filterText, usersContacts]
  );

  const [selectedContacts, setSelectedContacts] = useState([]);

  const dispatch = useDispatch();

  const buttonBackground = useThemeColor({}, "buttonBackground");
  const buttonText = useThemeColor({}, "buttonText");

  const handleAdd = () => {
    dispatch(addPlayers(selectedContacts));
    setSelectedContacts([]);
    handleClose();
  };

  const players = useSelector((state) => state.players);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          sort: Contacts.SortTypes.FirstName,
          rawContacts: true,
          fields: [Contacts.Fields.Image],
        });

        const contacts = data.map(({ id, image, firstName, lastName }) => {
          return {
            id,
            name:
              (firstName ? firstName + " " : "") + (lastName ? lastName : ""),
            avatar: image?.uri,
          };
        });

        if (contacts.length > 0) {
          setUsersContacts(contacts);
          setSelectedContacts(contacts.slice(0, 10));
        }
      }
    })();
  }, []);

  return (
    <ThemedModal style={{ flexGrow: 1 }} {...rest}>
      <View style={{ flex: 1, gap: 20 }}>
        <View style={{ flex: 0 }}>
          <ThemedTextInput
            onChangeText={setFilterText}
            value={filterText}
            placeholder="Filter"
          />
        </View>
        <View style={{ flexGrow: 0, flexShrink: 1, flexBasis: "auto" }}>
          <FlatList
            data={filteredContacts}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  backgroundColor: useThemeColor({}, "rules"),
                  height: StyleSheet.hairlineWidth,
                }}
              />
            )}
            renderItem={({ item }) => (
              <ContactRow
                disabled={players.some(({ id }) => id === item.id)}
                contact={item}
                handleSelected={() =>
                  setSelectedContacts((selected) => {
                    const exists = selected.some(({ id }) => id === item.id);
                    return exists
                      ? selected.filter(({ id }) => id !== item.id)
                      : [...selected, item];
                  })
                }
                isSelected={selectedContacts.some(({ id }) => id === item.id)}
              />
            )}
            contentContainerStyle={{ flexGrow: 1 }}
            style={{}}
          />
        </View>

        <View style={{ gap: 10, flex: 0 }}>
          <ThemedButton onPress={handleAdd}>Add Selected</ThemedButton>
          <ThemedButton type="danger" onPress={handleClose}>
            Cancel
          </ThemedButton>
        </View>
      </View>
    </ThemedModal>
  );
};
