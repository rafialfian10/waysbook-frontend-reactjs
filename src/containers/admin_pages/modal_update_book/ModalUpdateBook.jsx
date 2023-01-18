/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Button, Image, Form, Modal, FloatingLabel } from "react-bootstrap";

// css
import './ModalUpdateBook.scss'
import Swal from "sweetalert2";

// image
import addlistbook from '../../../assets/img/addlistbook.png'
import attache from '../../../assets/img/attache.png'

// api
import { API } from "../../../config/api";

const ModalUpdateBook = ({modalUpdate, setModalUpdate, value, bookId, refetchBook}) => {

    console.log("Value", value)

    const navigate = useNavigate()

    //state form
    const [form, setForm] = useState({
        title: '',
        publicationDate: '',
        isbn: '',
        pages: '',
        author: '',
        price: '',
        description: '',
        book: '',
        thumbnail: '',
        quota: '',
    })

    // console.log("Form", form)

    useEffect(() => {
        setForm({
            title: value?.title,
            publicationDate: value?.publicationDate,
            isbn: value?.isbn,
            pages: value?.pages,
            author: value?.author,
            price: value?.price,
            description: value?.description,
            book: value?.book,
            thumbnail: value?.thumbnail,
            quota: value?.quota,
        })
    }, [value])

    // state error
    const [error, setError] = useState({
        title: '',
        publicationDate: '',
        isbn: '',
        pages: '',
        author: '',
        price: '',
        description: '',
        book: '',
        thumbnail: '',
        quota: '',
    });

    // handle change
    const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]:
            e.target.type === 'file' ? e.target.files : e.target.value,
        })
    };

    // handle set discount book
    const handleUpdateBookPromo = useMutation( async () => {
        try {
            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            };

            const messageError = {
                title: '',
                publicationDate: '',
                isbn: '',
                pages: '',
                author: '',
                price: '',
                description: '',
                book: '',
                thumbnail: '',
                quota: '',
            };

            // validasi title
            if (form.title === "") {
                messageError.title = "Title must be filled out";
            } else {
                messageError.title = ""
            }

            // validasi publication date
            if (form.publicationDate === "") {
                messageError.publicationDate = "Publication Date must be filled out";
            } else {
                messageError.publicationDate = ""
            }

            // validasi isbn
            if (form.isbn === "") {
                messageError.isbn = "ISBN Date must be filled out";
            } else {
                messageError.isbn = ""
            }

            // validasi pages
            if (form.pages === "") {
                messageError.pages = "Pages must be filled out";
            } else if (form.pages < 0) {
                messageError.pages = "can't be less than 0"
            } else {
                messageError.pages = ""
            }

            // validasi author
            if (form.author === "") {
                messageError.author = "Author Date must be filled out";
            } else {
                messageError.author = ""
            }

            // price
            if (form.price === "") {
                messageError.price = "Price must be filled out";
            } else if (form.price < 0) {
                messageError.price = "can't be less than 0"
            } else {
                messageError.price = ""
            }

            // validasi description
            if (form.description === "") {
                messageError.description = "Description must be filled out";
            } else {
                messageError.description = ""
            }

            // validasi author
            if (form.book === "") {
                messageError.book = "Book must be filled out";
            } else {
                messageError.book = ""
            }

            // validasi Image
            if (form.thumbnail === "") {
                messageError.thumbnail = "image must be filled out";
            } else {
                messageError.thumbnail = ""
            }

            // validasi quota
            if (form.quota === "") {
                messageError.quota = "Quota must be filled out";
            } else if (form.quota < 0) {
                messageError.quota = "can't be less than 0"
            } else {
                messageError.quota = ""
            }


            if (messageError.title === "" &&
                messageError.publicationDate === "" &&
                messageError.isbn === "" &&
                messageError.pages === "" &&
                messageError.author === "" &&
                messageError.price === "" &&
                messageError.description === "" &&
                messageError.book === "" &&
                messageError.thumbnail === "" &&
                messageError.quota === ""
                ) {

                const formData = new FormData();
                formData.append('title', form.title);
                formData.append('publication_date', form.publicationDate);
                formData.append('author', form.author);
                formData.append('pages', form.pages);
                formData.append('isbn', form.isbn);
                formData.append('price', form.price);
                formData.append('quota', form.quota);
                formData.append('description', form.description);
                formData.append('book', form.book[0]);
                formData.append('thumbnail', form.thumbnail[0]);
               
                const response = await API.patch(`/book/${bookId}`, formData, config);
                console.log("Response :", response);
                if(response.status === 200) {
                    refetchBook()
                }

                // setModalUpdate(false)

                Swal.fire({
                    text: 'Book successfully updated',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                })

                setForm({
                    title: '',
                    publicationDate: '',
                    isbn: '',                   
                    pages: '',
                    author: '',
                    price: '',
                    description: '',
                    book: '',
                    thumbnail: '',
                    quota: '',
                })

                navigate('/incom_book'); 
            } else {
                setError(messageError)
            }
        } catch (err) {
            console.log(err)
        }
    })

    return (
        <>
            <Modal show={modalUpdate} onHide={() => setModalUpdate(false)} className="modal-update-book" size="lg">
                <Modal.Body className="modal-body-update-book">
                    <h2 className="title-update-book">Update Book</h2>
                        <Form className='form-update-book' onSubmit={(e) => {e.preventDefault() 
                        handleUpdateBookPromo.mutate(e)}}>

                        <Form.Group className="form-group">
                        <Form.Control className="form-input" name="title" type="text" placeholder='Title' value={form.title} onChange={(e) => handleChange(e, 'title')}/>
                        </Form.Group>
                        {error.title && <Form.Text className="text-danger">{error.title}</Form.Text>}

                        <Form.Group className="form-group">
                        <Form.Control className="form-input" name="publication_date" type="date" placeholder='Publication Date' value={form.publicationDate} onChange={(e) => handleChange(e, 'publication_date')}/>
                        </Form.Group>
                        {error.publicationDate && <Form.Text className="text-danger">{error.publicationDate}</Form.Text>}

                        <Form.Group className="form-group">
                        <Form.Control className="form-input" name="isbn" type="text" placeholder='isbn' value={form.isbn} onChange={(e) => handleChange(e, 'isbn')}/>
                        </Form.Group>
                        {error.isbn && <Form.Text className="text-danger">{error.isbn}</Form.Text>}

                        <Form.Group className="form-group">
                        <Form.Control className="form-input" name="pages" type="number" placeholder='Pages' value={form.pages} onChange={(e) => handleChange(e, 'pages')}/>
                        </Form.Group>
                        {error.pages && <Form.Text className="text-danger">{error.pages}</Form.Text>}

                        <Form.Group className="form-group">
                        <Form.Control className="form-input" name="author" type="text" placeholder='Author' value={form.author} onChange={(e) => handleChange(e, 'author')}/>
                        </Form.Group>
                        {error.author && <Form.Text className="text-danger">{error.author}</Form.Text>}

                        <Form.Group className="form-group">
                        <Form.Control className="form-input" name="price" type="number" placeholder='Price' value={form.price} onChange={(e) => handleChange(e, 'price')}/>
                        </Form.Group>
                        {error.price && <Form.Text className="text-danger">{error.price}</Form.Text>}

                        <Form.Group className="form-group">
                        <Form.Control className="form-input" name="quota" type="number" placeholder='Quota' value={form.quota} onChange={(e) => handleChange(e, 'quota')}/>
                        </Form.Group>
                        {error.quota && <Form.Text className="text-danger">{error.quota}</Form.Text>}

                        <Form.Group className="form-group">
                        <FloatingLabel controlId="floatingTextarea2">
                            <Form.Control as="textarea" className="form-input" name="description" placeholder='Add This Book' style={{ height: '100px' }} value={form.description} onChange={(e) => handleChange(e, 'image')}/>
                            {error.description && <Form.Text className="text-danger">{error.description}</Form.Text>}
                        </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="form-group">
                        <div className="img-upload">
                            <label for="book" className="form-input">
                                <p>Book</p>
                                <img src={attache} alt=""/>
                            </label>
                            <Form.Control className="form-input" name="book" type="file" id="book" onChange={(e) => handleChange(e, 'book')} />
                        </div>
                        {error.book && <Form.Text className="text-danger">{error.book}</Form.Text>}
                        </Form.Group>

                        <Form.Group className="form-group">
                        <div className="img-upload">
                            <label for="thumbnail" className="form-input">
                                <p>Image</p>
                                <img src={attache} alt=""/>
                            </label>
                            <Form.Control className="form-input" name="thumbnail" type="file" id="thumbnail" onChange={(e) => handleChange(e, 'thumbnail')}/>
                        </div>
                        {error.thumbnail && <Form.Text className="text-danger">{error.thumbnail}</Form.Text>}
                        </Form.Group>

                        <div className='btn-update-book-content'>
                            <Button type="submit" className='btn-update-book'>Update Book<Image src={addlistbook} className='img-update-book'/></Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ModalUpdateBook;