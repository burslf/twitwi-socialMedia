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
        //   width: "90vw",
        //   height: "90vh",
          backgroundColor: "tansparent",
          color: "black",
          // border: "3px solid rgba(104, 207, 255, 0.885)",
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
