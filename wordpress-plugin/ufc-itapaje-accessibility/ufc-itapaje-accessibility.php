<?php
/**
 * Plugin Name: UFC Itapajé Accessibility
 * Plugin URI:  https://github.com/JBrunoS/ufc-itapaje-accessibility
 * Description: Widget de acessibilidade customizável com suporte a temas, fonte para dislexia, ocultar imagens e mais.
 * Version:     1.0.0
 * Author:      João Bruno Sousa
 * License:     MIT
 * Text Domain: ufc-itapaje-accessibility
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'UITA_VERSION', '1.0.0' );
define( 'UITA_OPTION', 'uita_settings' );

// ---------- Frontend ----------

add_action( 'wp_enqueue_scripts', 'uita_enqueue' );
function uita_enqueue() {
    $opts = uita_get_options();

    if ( empty( $opts['enabled'] ) ) return;

    wp_enqueue_script(
        'ufc-itapaje-accessibility',
        'https://cdn.jsdelivr.net/npm/ufc-itapaje-accessibility@' . UITA_VERSION . '/dist/index.global.js',
        [],
        UITA_VERSION,
        true
    );

    $config = [
        'session' => [ 'persistent' => true ],
        'labels'  => [
            'menuTitle'            => $opts['label_menu']           ?? 'Acessibilidade',
            'resetTitle'           => $opts['label_reset']          ?? 'Redefinir',
            'closeTitle'           => $opts['label_close']          ?? 'Fechar',
            'increaseText'         => 'Aumentar texto',
            'decreaseText'         => 'Diminuir texto',
            'increaseTextSpacing'  => 'Aumentar espaçamento',
            'decreaseTextSpacing'  => 'Diminuir espaçamento',
            'increaseLineHeight'   => 'Aumentar altura de linha',
            'decreaseLineHeight'   => 'Diminuir altura de linha',
            'invertColors'         => 'Inverter cores',
            'grayHues'             => 'Tons de cinza',
            'bigCursor'            => 'Cursor grande',
            'readingGuide'         => 'Guia de leitura',
            'underlineLinks'       => 'Sublinhar links',
            'textToSpeech'         => 'Texto para fala',
            'speechToText'         => 'Fala para texto',
            'disableAnimations'    => 'Desativar animações',
            'dyslexicFont'         => 'Fonte para dislexia',
            'hideImages'           => 'Ocultar imagens',
        ],
        'modules' => [
            'increaseText'        => ! empty( $opts['mod_increaseText'] ),
            'decreaseText'        => ! empty( $opts['mod_decreaseText'] ),
            'increaseTextSpacing' => ! empty( $opts['mod_increaseTextSpacing'] ),
            'decreaseTextSpacing' => ! empty( $opts['mod_decreaseTextSpacing'] ),
            'increaseLineHeight'  => ! empty( $opts['mod_increaseLineHeight'] ),
            'decreaseLineHeight'  => ! empty( $opts['mod_decreaseLineHeight'] ),
            'invertColors'        => ! empty( $opts['mod_invertColors'] ),
            'grayHues'            => ! empty( $opts['mod_grayHues'] ),
            'bigCursor'           => ! empty( $opts['mod_bigCursor'] ),
            'readingGuide'        => ! empty( $opts['mod_readingGuide'] ),
            'underlineLinks'      => ! empty( $opts['mod_underlineLinks'] ),
            'textToSpeech'        => ! empty( $opts['mod_textToSpeech'] ),
            'speechToText'        => ! empty( $opts['mod_speechToText'] ),
            'disableAnimations'   => ! empty( $opts['mod_disableAnimations'] ),
            'dyslexicFont'        => ! empty( $opts['mod_dyslexicFont'] ),
            'hideImages'          => ! empty( $opts['mod_hideImages'] ),
        ],
    ];

    if ( ! empty( $opts['logo_url'] ) ) {
        $config['logoImage'] = esc_url( $opts['logo_url'] );
    }

    wp_add_inline_script(
        'ufc-itapaje-accessibility',
        'new Accessibility.Accessibility(' . wp_json_encode( $config ) . ');'
    );
}

// ---------- Admin ----------

add_action( 'admin_menu', 'uita_admin_menu' );
function uita_admin_menu() {
    add_options_page(
        'Accessibility Widget',
        'Accessibility Widget',
        'manage_options',
        'uita-settings',
        'uita_settings_page'
    );
}

add_action( 'admin_init', 'uita_register_settings' );
function uita_register_settings() {
    register_setting( 'uita_group', UITA_OPTION, 'uita_sanitize' );
}

function uita_sanitize( $input ) {
    $clean = [];

    $clean['enabled']     = ! empty( $input['enabled'] ) ? 1 : 0;
    $clean['label_menu']  = sanitize_text_field( $input['label_menu']  ?? 'Acessibilidade' );
    $clean['label_reset'] = sanitize_text_field( $input['label_reset'] ?? 'Redefinir' );
    $clean['label_close'] = sanitize_text_field( $input['label_close'] ?? 'Fechar' );
    $clean['logo_url']    = esc_url_raw( $input['logo_url'] ?? '' );

    $modules = [
        'increaseText', 'decreaseText', 'increaseTextSpacing', 'decreaseTextSpacing',
        'increaseLineHeight', 'decreaseLineHeight', 'invertColors', 'grayHues',
        'bigCursor', 'readingGuide', 'underlineLinks', 'textToSpeech',
        'speechToText', 'disableAnimations', 'dyslexicFont', 'hideImages',
    ];
    foreach ( $modules as $mod ) {
        $clean[ 'mod_' . $mod ] = ! empty( $input[ 'mod_' . $mod ] ) ? 1 : 0;
    }

    return $clean;
}

function uita_get_options() {
    $defaults = [
        'enabled'               => 1,
        'label_menu'            => 'Acessibilidade',
        'label_reset'           => 'Redefinir',
        'label_close'           => 'Fechar',
        'logo_url'              => '',
        'mod_increaseText'      => 1, 'mod_decreaseText'        => 1,
        'mod_increaseTextSpacing' => 1, 'mod_decreaseTextSpacing' => 1,
        'mod_increaseLineHeight'  => 1, 'mod_decreaseLineHeight'  => 1,
        'mod_invertColors'      => 1, 'mod_grayHues'            => 1,
        'mod_bigCursor'         => 1, 'mod_readingGuide'        => 1,
        'mod_underlineLinks'    => 1, 'mod_textToSpeech'        => 1,
        'mod_speechToText'      => 1, 'mod_disableAnimations'   => 1,
        'mod_dyslexicFont'      => 1, 'mod_hideImages'          => 1,
    ];
    return wp_parse_args( get_option( UITA_OPTION, [] ), $defaults );
}

function uita_settings_page() {
    if ( ! current_user_can( 'manage_options' ) ) return;
    $opts = uita_get_options();

    $modules_labels = [
        'increaseText'        => 'Aumentar texto',
        'decreaseText'        => 'Diminuir texto',
        'increaseTextSpacing' => 'Aumentar espaçamento',
        'decreaseTextSpacing' => 'Diminuir espaçamento',
        'increaseLineHeight'  => 'Aumentar altura de linha',
        'decreaseLineHeight'  => 'Diminuir altura de linha',
        'invertColors'        => 'Inverter cores',
        'grayHues'            => 'Tons de cinza',
        'bigCursor'           => 'Cursor grande',
        'readingGuide'        => 'Guia de leitura',
        'underlineLinks'      => 'Sublinhar links',
        'textToSpeech'        => 'Texto para fala',
        'speechToText'        => 'Fala para texto',
        'disableAnimations'   => 'Desativar animações',
        'dyslexicFont'        => 'Fonte para dislexia',
        'hideImages'          => 'Ocultar imagens',
    ];
    ?>
    <div class="wrap">
        <h1>Accessibility Widget</h1>
        <form method="post" action="options.php">
            <?php settings_fields( 'uita_group' ); ?>

            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row">Ativar widget</th>
                    <td>
                        <input type="checkbox" name="<?= UITA_OPTION ?>[enabled]" value="1" <?php checked( $opts['enabled'], 1 ); ?>>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Título do menu</th>
                    <td><input type="text" name="<?= UITA_OPTION ?>[label_menu]" value="<?= esc_attr( $opts['label_menu'] ) ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th scope="row">Botão redefinir</th>
                    <td><input type="text" name="<?= UITA_OPTION ?>[label_reset]" value="<?= esc_attr( $opts['label_reset'] ) ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th scope="row">Botão fechar</th>
                    <td><input type="text" name="<?= UITA_OPTION ?>[label_close]" value="<?= esc_attr( $opts['label_close'] ) ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th scope="row">URL do logo <span style="font-weight:normal">(opcional)</span></th>
                    <td><input type="url" name="<?= UITA_OPTION ?>[logo_url]" value="<?= esc_attr( $opts['logo_url'] ) ?>" class="regular-text" placeholder="https://..."></td>
                </tr>
                <tr>
                    <th scope="row">Módulos visíveis</th>
                    <td>
                        <?php foreach ( $modules_labels as $key => $label ) : ?>
                            <label style="display:inline-block;min-width:220px;margin-bottom:6px">
                                <input type="checkbox" name="<?= UITA_OPTION ?>[mod_<?= $key ?>]" value="1" <?php checked( $opts[ 'mod_' . $key ], 1 ); ?>>
                                <?= esc_html( $label ) ?>
                            </label>
                        <?php endforeach; ?>
                    </td>
                </tr>
            </table>

            <?php submit_button( 'Salvar configurações' ); ?>
        </form>
    </div>
    <?php
}
