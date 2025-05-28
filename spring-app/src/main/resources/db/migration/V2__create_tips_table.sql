CREATE TABLE tip (
    id BIGSERIAL PRIMARY KEY,
    sender_id VARCHAR(255) NOT NULL,
    receiver_id VARCHAR(255) NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES user_(id),
    FOREIGN KEY (receiver_id) REFERENCES user_(id)
); 