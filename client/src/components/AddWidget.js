function AddWidget(props) {
  return (
    <div className="col" onClick={props.addPickupWidget}>
      <div className="card--add p-0 border-0">
        <button className="btn btn-light btn-add">
          <i className="fas fa-plus"></i>
        </button>
      </div>
    </div>
  );
}

export default AddWidget;
