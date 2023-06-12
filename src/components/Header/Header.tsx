import { Link } from 'react-router-dom';
import paths from 'src/constants/paths';

function Header() {
    return (
        <div>
            Header
            <div className='flex items-center'>
                <Link to={paths.register} className='mx-3 capitalize'>
                    Đăng Ký
                </Link>
                <Link to={paths.login}>Đăng Nhập</Link>
            </div>
        </div>
    );
}

export default Header;
