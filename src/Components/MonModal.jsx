import Modal from "react-modal";

const MonModal = (props) => {


  return (
    <Modal
      style={{
        overlay: {
          backgroundColor: "transparent",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "tansparent",
          color: "black",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px",
          alignItems: "center"
        },
      }}
      isOpen={props.isOpen}
      onRequestClose={props.setIsModalOpen}
    >
        <img src={props.imgSrc} alt='' className="modal-image"/>
    </Modal>
  );
};

export default MonModal;
