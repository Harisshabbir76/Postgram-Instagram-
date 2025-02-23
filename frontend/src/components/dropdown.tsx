import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

function SplitBasicExample({ handleLogout }) {
  return (
    <Dropdown as={ButtonGroup}>
      <Button variant="success" href="/profile">Profile</Button>

      <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

      <Dropdown.Menu>
        <Dropdown.Item href="/upload">Upload</Dropdown.Item>
        <Dropdown.Item href="/profile/profile-info/">Edit Profile</Dropdown.Item>
        {/* ✅ Call handleLogout on Logout click */}
        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SplitBasicExample;
