import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Platform,
} from 'react-native';
import { Rating } from 'react-native-ratings';

interface ModalAvaliacaoProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (nota: number, comentario: string) => void;
}

export const ModalAvaliacao: React.FC<ModalAvaliacaoProps> = ({
    visible,
    onClose,
    onSubmit,
}) => {
    const [nota, setNota] = useState(5);
    const [comentario, setComentario] = useState('');

    const handleSubmit = () => {
        onSubmit(nota, comentario);
        setNota(5);
        setComentario('');
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Avaliar Serviço</Text>
                    
                    <View style={styles.ratingContainer}>
                        <Text style={styles.label}>Sua avaliação:</Text>
                        <Rating
                            showRating
                            onFinishRating={setNota}
                            style={styles.rating}
                            startingValue={nota}
                            imageSize={30}
                        />
                    </View>

                    <View style={styles.commentContainer}>
                        <Text style={styles.label}>Comentário:</Text>
                        <TextInput
                            style={styles.input}
                            multiline
                            numberOfLines={4}
                            value={comentario}
                            onChangeText={setComentario}
                            placeholder="Digite seu comentário sobre o serviço..."
                            placeholderTextColor="#666"
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.submitButton]}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.buttonText}>Enviar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    ratingContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    rating: {
        paddingVertical: 10,
    },
    commentContainer: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: '#333',
        textAlignVertical: 'top',
        minHeight: 100,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#666',
    },
    submitButton: {
        backgroundColor: '#A75C00',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 