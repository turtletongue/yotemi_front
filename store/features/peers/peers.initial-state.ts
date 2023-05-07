export interface PeersState {
  disconnected: boolean;
}

const peersInitialState: PeersState = {
  disconnected: false,
};

export default peersInitialState;
